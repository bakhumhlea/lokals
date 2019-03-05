import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components'

export default function Spinner(props) {
  const Spinner = props.spinnerStyle ? styled.div`
    display: block;
    top: ${props.spinnerStyle.top || 'initial'};
    right: ${props.spinnerStyle.right || 'initial'};
    bottom: ${props.spinnerStyle.bottom || 'initial'};
    left: ${props.spinnerStyle.left || 'initial'};
    position: ${props.spinnerStyle.position || 'absolute'};
    width: ${props.spinnerStyle.width || '100%'};
    height: ${props.spinnerStyle.height || '100%'};
    text-align: center;
    font-size: 1.4em;
    background: transparent;
    color: ${props.spinnerStyle.color};
    ${ props.spinnerStyle.transform && 'transform:'+props.spinnerStyle.transform+';' }
  `:
  styled.div`
    display: block;
    position: ${'relative'};
    width: ${'100%'};
    height: ${'100%'};
    text-align: center;
    font-size: 1.4em;
    background: transparent;
    color: black;
  `;
  return (
    <Spinner>
      <FontAwesomeIcon icon="spinner" spin/>
    </Spinner>
  )
}
