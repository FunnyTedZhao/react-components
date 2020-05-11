import React from 'react';
import ReactDOM from 'react-dom';
import 'react-components/style/component.css';// eslint-disable-line
import {Block, AreaSelector} from 'react-components/src'; // eslint-disable-line

ReactDOM.render(
  <div className="component-template" style={{ padding: '20px' }}>
    <Block />
    <AreaSelector value={['650000', '469023']} />
  </div>,
  document.getElementById('example'),
);
