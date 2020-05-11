/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Checkbox, Icon } from 'antd';
import './style/cascader.less';

class AreaCascader extends React.Component {
  constructor(props) {
    super(props);
    this.cascaderRef = React.createRef();
    this.state = {
      value: props.value,
      showDatas: this.formatData(props.dataSource),
      actIndex: [null],
    };
  }

  componentDidMount() {
    this.renderUls();
  }

  componentDidUpdate() {
    this.renderUls();
  }

  formatData = (dataSource, parentChecked = false, level = 0) => {
    const { fieldName, value } = this.props;
    return dataSource.map(data => {
      const checked = value.includes(data[fieldName.code]) || parentChecked;
      return {
        name: data[fieldName.name],
        phonetic: data[fieldName.phonetic],
        code: data[fieldName.code],
        checked,
        level,
        children: data[fieldName.children]
          ? this.formatData(data[fieldName.children], checked, level + 1)
          : [],
      };
    });
  };

  handleLiClick = (e, data, index) => {
    const { target } = e;
    if (target.type === 'checkbox') {
      return;
    }
    const { actIndex } = this.state;
    const { level, children } = data;
    actIndex[level] = index;
    let len = actIndex.length;
    len = children.length > 0 && level + 1 === len ? len + 1 : len;
    for (let i = level + 1; i < len; i++) {
      actIndex[i] = null;
    }
    this.setState({
      actIndex,
    });
  };

  handleCheck = data => {
    /* const { value } = this.state;
    if (value.includes(data.code)) {
      const index = value.indexOf(data.code);
      value.splice(index, 1);
    } else {
      value.push(data.code);
    }
    this.setState({
      value,
    }); */
  };

  getLvData = targetLv => {
    const { showDatas, actIndex } = this.state;
    const fn = (data, currentLv = 0) => {
      if (targetLv === currentLv) {
        return data;
      } else if (actIndex[currentLv] != null) {
        return fn(data[actIndex[currentLv]].children, currentLv + 1);
      }
      return [];
    };
    return fn(showDatas);
  };

  renderUls = () => {
    const { actIndex } = this.state;
    const cascaderDom = this.cascaderRef.current;
    const len = actIndex.length;
    if (!this.ulDoms) {
      this.ulDoms = [];
    }
    for (let i = 0; i < len; i++) {
      if (!this.ulDoms[i]) {
        const div = document.createElement('div');
        div.style.float = 'left';
        div.style.borderLeft = i === 0 ? '' : '1px solid #e8e8e8';
        this.ulDoms[i] = div;
        cascaderDom.appendChild(div);
      }
      ReactDOM.render(this.createUl(this.getLvData(i), i), this.ulDoms[i]);
    }
  };

  createUl = (lvData, level = 0) => {
    const { actIndex } = this.state;
    const baseClass = 'mine-area';
    const Lis = (data, index) => (
      <li
        key={`cascader-${level}-${data.code}`}
        className={classNames(`${baseClass}-cascader-item`, {
          [`${baseClass}-cascader-item-active`]: index === actIndex[level],
        })}
        onClick={e => {
          this.handleLiClick(e, data, index);
        }}
      >
        <Checkbox
          checked={data.checked}
          onChange={() => {
            this.handleCheck(data);
          }}
        />
        <span style={{ padding: '0 8px' }}>{data.name}</span>
        {data.children && data.children.length > 0 ? (
          <span className={classNames(`${baseClass}-cascader-arrow`)}>
            <Icon type="right" />
          </span>
        ) : null}
      </li>
    );
    return (
      <ul key={`cascader-${level}`} className={classNames(`${baseClass}-cascader-items`)}>
        {lvData.map((data, index) => Lis(data, index))}
      </ul>
    );
  };

  render() {
    const baseClass = 'mine-area';
    return <div ref={this.cascaderRef} className={classNames(`${baseClass}-cascader`)} />;
  }
}

AreaCascader.defaultProps = {};

AreaCascader.propTypes = {
  value: PropTypes.array.isRequired,
  dataSource: PropTypes.array.isRequired,
  fieldName: PropTypes.object.isRequired,
};

export default AreaCascader;
