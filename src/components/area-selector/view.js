import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Input } from 'antd';
import AreaCascader from './cascader';
import './style/view.less';

class AreaView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: '',
    };
  }

  render() {
    const { size, style, value, dataSource, fieldName, isOpen } = this.props;
    const { keyword } = this.state;
    const { Search } = Input;
    const baseClass = 'mine-area';
    return (
      <div
        className={classNames(`${baseClass}-view`, {
          [`${baseClass}-view-hide`]: !isOpen,
        })}
        style={style}
      >
        <Search size={size} onSearch={() => {}} />
        <AreaCascader
          value={value}
          keyword={keyword}
          dataSource={dataSource}
          fieldName={fieldName}
        />
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
};

export default AreaView;
