import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Input, Button } from 'antd';
import AreaCascader from './cascader';
import './style/view.less';

class AreaView extends React.Component {
  constructor(props) {
    super(props);
    this.cascaderRef = React.createRef();
    this.state = {
      keyword: '',
    };
  }

  handleOkClick = () => {
    const { handleChange } = this.props;
    const cascaderDom = this.cascaderRef.current;
    const {
      state: { showDatas },
    } = cascaderDom;
    const arr = [];
    const fn = data => {
      const len = data.length;
      for (let i = 0; i < len; i++) {
        const { checked, indeterminate, code, children } = data[i];
        if (checked) {
          arr.push(code);
        } else if (indeterminate && children.length > 0) {
          fn(children);
        }
      }
      return arr;
    };
    handleChange(fn(showDatas), () => {
      cascaderDom.updateRawDatas();
    });
  };

  handleCancelClick = () => {
    const { handleCancel } = this.props;
    const cascaderDom = this.cascaderRef.current;
    handleCancel(() => {
      cascaderDom.restoreShowDatas();
    });
  };

  render() {
    const { size, style, value, dataSource, fieldName, isOpen, okText, cancelText } = this.props;
    const { keyword } = this.state;
    // const { Search } = Input;
    const baseClass = 'mine-area-select';
    return (
      <div
        className={classNames(`${baseClass}-view`, {
          [`${baseClass}-view-hide`]: !isOpen,
        })}
        style={style}
      >
        {/* <Search className={classNames(`${baseClass}-search`)} size={size} onSearch={() => {}} /> */}
        <AreaCascader
          ref={this.cascaderRef}
          value={value}
          keyword={keyword}
          dataSource={dataSource}
          fieldName={fieldName}
        />
        <div className={classNames(`${baseClass}-btn-box`)}>
          <Button
            className={classNames(`${baseClass}-btn`, `${baseClass}-btn-cancel`)}
            size={size}
            onClick={() => {
              this.handleCancelClick();
            }}
          >
            {cancelText}
          </Button>
          <Button
            className={classNames(`${baseClass}-btn`, `${baseClass}-btn-ok`)}
            type="primary"
            size={size}
            onClick={() => {
              this.handleOkClick();
            }}
          >
            {okText}
          </Button>
        </div>
      </div>
    );
  }
}

AreaView.defaultProps = {};

AreaView.propTypes = {
  value: PropTypes.array.isRequired,
  isOpen: PropTypes.bool.isRequired,
  size: PropTypes.string.isRequired,
  style: PropTypes.object.isRequired,
  dataSource: PropTypes.array.isRequired,
  fieldName: PropTypes.object.isRequired,
  okText: PropTypes.string.isRequired,
  cancelText: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
};

export default AreaView;
