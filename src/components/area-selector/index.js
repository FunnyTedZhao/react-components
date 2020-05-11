/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Tag, Icon } from 'antd';
import AreaView from './view';
import areaLists from './data/city_20200428.json';
import './style/index.less';

class AreaSelector extends React.Component {
  constructor(props) {
    super(props);
    this.resultRef = React.createRef();
    this.state = {
      isOpen: false,
      value: props.value,
    };
  }

  componentDidMount() {
    document.addEventListener('click', this.handleDivClick);
  }

  componentDidUpdate() {
    this.renderView();
  }

  componentWillUnmount() {
    document.addEventListener('click', this.handleDivClick);
  }

  handleDivClick = e => {
    const { target } = e;
    const resultDom = this.resultRef.current;
    if (!resultDom.contains(target)) {
      return;
    }
    const { isOpen } = this.state;
    this.setState({
      isOpen: !isOpen,
    });
  };

  handleChange = () => {};

  handleTagClose = () => {};

  renderView = () => {
    const resultDom = this.resultRef.current;
    const { size, dataSource, fieldName } = this.props;
    const { value, isOpen } = this.state;

    if (!this.viewDom) {
      const div = document.createElement('div');
      div.style.left = '0';
      div.style.position = 'absolute';
      div.style.top = '0';
      div.style.width = '100%';
      this.viewDom = div;
      document.body.appendChild(this.viewDom);
    }

    const locationObj = resultDom.getBoundingClientRect();
    const style = {
      left: locationObj.left + document.documentElement.scrollLeft,
      top: locationObj.top + document.documentElement.scrollTop + resultDom.offsetHeight + 8,
      width: resultDom.offsetWidth,
    };
    ReactDOM.render(
      <AreaView
        value={value}
        isOpen={isOpen}
        size={size}
        style={style}
        dataSource={dataSource}
        fieldName={fieldName}
      />,
      this.viewDom,
    );
  };

  getNames = () => {
    const { value } = this.state;
    return value.map(v => {
      const obj = this.getBranch(v);
      const names = [];
      const parents = obj.parentNodes;
      parents.forEach(p => {
        names.push(p.name);
      });
      const { node } = obj;
      names.push(node.name);
      return {
        name: names.join('/'),
        code: node.code,
      };
    });
  };

  /* 去重逻辑 */
  /* fn = () => {
    const temp = [];
    const vLen = value.length;
    for (let v = 0; v < vLen; v++) {
      const obj = this.getBranch(value[v]);
      const parents = obj.parentNodes;
      const pLen = parents.length;
      if (pLen > 0) {
        // 判断祖先节点的值是否在传入数据中已存在
        let isHave = false;
        const names = [];
        for (let i = 0; i < parents.length; i++) {
          if (value.includes(parents[i].code)) {
            isHave = true;
            break;
          } else {
            names.push(parents[i].name);
          }
        }
        if (!isHave) {
          const { name, code } = obj.node;
          names.push(name);
          temp.push({
            name: names.join('/'),
            code,
          });
        }
      } else {
        const { name, code } = obj.node;
        temp.push({
          name,
          code,
        });
      }
    }
    return temp;
  } */

  getBranch = value => {
    const { dataSource } = this.props;
    const parentNodes = []; // 存储该节点上级节点
    let node = null; // 存储该节点
    const fn = (source, code, level = 0) => {
      const { fieldName } = this.props;
      const len = source.length;
      for (let i = 0; i < len; i++) {
        if (node) {
          break;
        }
        const obj = source[i];
        if (obj[fieldName.code] === code) {
          node = Object.assign(
            {},
            {
              code: obj[fieldName.code],
              name: obj[fieldName.name],
            },
          );
          break;
        }
        if (obj[fieldName.children]) {
          parentNodes[level] = Object.assign(
            {},
            {
              code: obj[fieldName.code],
              name: source[i][fieldName.name],
            },
          );
          fn(obj[fieldName.children], code, level + 1);
        }
      }

      if (!node && level > 0) {
        parentNodes.splice(level - 1, 1);
      }

      return {
        parentNodes,
        node,
      };
    };
    return fn(dataSource, value);
  };

  render() {
    const { size, placeholder } = this.props;
    const { isOpen } = this.state;
    const baseClass = 'mine-area';
    return (
      <div
        ref={this.resultRef}
        className={classNames(`${baseClass}-select`, {
          [`${baseClass}-select-lg`]: size === 'large',
          [`${baseClass}-select-sm`]: size === 'small',
          [`${baseClass}-select-open`]: isOpen,
        })}
        onClick={() => {}}
      >
        {this.getNames().length > 0 ? (
          <ul className={classNames(`${baseClass}-items`)}>
            {this.getNames().map(v => (
              <li className={classNames(`${baseClass}-item`)} key={`area-${v.code}`}>
                <Tag closable onClose={this.handleTagClose}>
                  {v.name}
                </Tag>
              </li>
            ))}
          </ul>
        ) : (
          <span>{placeholder}</span>
        )}
        <span className={classNames(`${baseClass}-arrow`)}>
          <Icon type="down" />
        </span>
      </div>
    );
  }
}

AreaSelector.defaultProps = {
  value: [],
  size: 'default',
  placeholder: '',
  dataSource: areaLists.data,
  fieldName: {
    name: 'cname',
    phonetic: 'pyname',
    code: 'code',
    children: 'list',
  },
};

AreaSelector.propTypes = {
  value: PropTypes.array,
  size: PropTypes.string,
  placeholder: PropTypes.string,
  dataSource: PropTypes.array,
  fieldName: PropTypes.object,
};

export default AreaSelector;
