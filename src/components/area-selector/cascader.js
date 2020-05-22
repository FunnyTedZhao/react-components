/* eslint-disable no-param-reassign */
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
      rawDatas: JSON.stringify(this.formatData(props.dataSource)),
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
    const getIndeterminate = data => {
      let hasChecked = false;
      const fn = children => {
        const len = children.length;
        for (let i = 0; i < len; i++) {
          if (hasChecked) {
            break;
          }
          const childChecked = value.includes(children[i][fieldName.code]);
          if (childChecked) {
            hasChecked = true;
            break;
          }
          if (children[i][fieldName.children]) {
            fn(children[i][fieldName.children]);
          }
        }
        return hasChecked;
      };
      return fn(data[fieldName.children] || []);
    };
    return dataSource.map(data => {
      const checked = value.includes(data[fieldName.code]) || parentChecked;
      return {
        name: data[fieldName.name],
        phonetic: data[fieldName.phonetic],
        code: data[fieldName.code],
        indeterminate: checked ? false : getIndeterminate(data),
        checked,
        level,
        children: data[fieldName.children]
          ? this.formatData(data[fieldName.children], checked, level + 1)
          : [],
      };
    });
  };

  updateRawDatas = () => {
    const { showDatas } = this.state;
    this.setState({
      rawDatas: JSON.stringify(showDatas),
    });
  };

  restoreShowDatas = () => {
    const { rawDatas } = this.state;
    this.setState({
      showDatas: JSON.parse(rawDatas),
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

  handleCheck = (data, index) => {
    const { level } = data;
    const tempData = this.handleLvCheck(level, index);
    this.setState({
      showDatas: tempData,
    });
  };

  handleLvCheck = (targetLv, targetIdx) => {
    const { showDatas, actIndex } = this.state;
    const childrenFn = (data, checked) => {
      const len = data.length;
      for (let i = 0; i < len; i++) {
        data[i].checked = checked;
        data[i].indeterminate = false;
        childrenFn(data[i].children, checked);
      }
    };
    const parentFn = (data, level) => {
      const len = data.length;
      let sum = 0;
      let hasIndeter = false;
      for (let i = 0; i < len; i++) {
        if (data[i].checked) {
          sum++;
        }
        if (data[i].indeterminate) {
          hasIndeter = true;
        }
      }
      const subFn = (findData, childrenLen, childrenSum, hasIndeterminate, currentLv = 0) => {
        if (level - 1 === currentLv) {
          findData[actIndex[currentLv]].checked = childrenLen === childrenSum;
          findData[actIndex[currentLv]].indeterminate =
            (childrenSum > 0 && childrenSum < childrenLen) || hasIndeterminate;
          parentFn(findData, currentLv);
        } else if (level > 0) {
          subFn(
            findData[actIndex[currentLv]].children,
            childrenLen,
            childrenSum,
            hasIndeterminate,
            currentLv + 1,
          );
        }
      };
      subFn(showDatas, len, sum, hasIndeter);
    };
    const fn = (data, currentLv = 0) => {
      if (targetLv === currentLv) {
        const checked = !data[targetIdx].checked;
        data[targetIdx].checked = checked;
        data[targetIdx].indeterminate = false;
        // 父级勾选
        parentFn(data, targetLv);
        // 子级勾选
        childrenFn(data[targetIdx].children, checked);
      } else {
        fn(data[actIndex[currentLv]].children, currentLv + 1);
      }
    };
    fn(showDatas);
    return showDatas;
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
    const baseClass = 'mine-area-select';
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
          indeterminate={data.indeterminate}
          onChange={() => {
            this.handleCheck(data, index);
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
      <ul
        key={`cascader-${level}`}
        className={classNames(`${baseClass}-cascader-items`)}
        style={{
          display: lvData.length > 0 ? 'block' : 'none',
        }}
      >
        {lvData.map((data, index) => Lis(data, index))}
      </ul>
    );
  };

  render() {
    const baseClass = 'mine-area-select';
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
