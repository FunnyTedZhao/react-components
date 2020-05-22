import React from 'react';
import ReactDOM from 'react-dom';
import 'react-components/style/component.css';// eslint-disable-line
import {AreaSelector} from 'react-components/src'; // eslint-disable-line

ReactDOM.render(
  <div className="component-template" style={{ padding: '20px' }}>
    <AreaSelector
      value={['650000', '469023', '620623']}
      onChange={value => {
        console.log(value);
      }}
    />
  </div>,
  document.getElementById('example'),
);
