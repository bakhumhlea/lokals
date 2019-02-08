import React from 'react'
import OpenTime from '../OpenTime';

export default function({marker, openInfoboxId,size}) {
  switch (size) {
    case "sm":
      return (
        <div 
          key={marker._id} 
          style={{
            cursor: 'pointer',
            display: `${openInfoboxId === marker._id? "block": "none"}`, 
            fontFamily: `'PT Sans', sans-serif`, 
            fontColor: `#08233B`, 
            backgroundColor: `white`, 
            // border: '1px solid black',
            borderRadius: `4px`, 
            padding: `3px 0 0 0`, 
            width: `150px` }}
        >
          <div style={{
            fontSize: `0.7rem`, 
            textAlign: 'left' , 
            width: `100%`, 
            whiteSpace: `wrap`, 
            padding: '0px',
            margin: 0, 
            color: 'black'}}>
            <h1 style={{fontSize: `0.7rem`, fontWeight: 700, margin: 0}}>{marker.business_name}</h1>
            <p style={{fontSize: `0.7rem`, fontWeight: 300, margin: '2px 0 0 0'}}>{marker.formatted_address.split(',').slice(0,1)}</p>
          </div>
        </div>
      )
    default:
      return (
        <div 
          key={marker._id} 
          style={{
            display: `${openInfoboxId === marker._id? "block": "none"}`, 
            backgroundColor: `white`, 
            borderRadius: `4px`, 
            padding: `4px 6px`, width: `150px` }}
        >
          <div 
          style={{ 
            fontSize: `0.7rem`, 
            fontColor: `#08233B`, 
            fontFamily: `'PT Sans', sans-serif`, 
            textAlign: 'left' , 
            display: 'flex', 
            flexDirection: 'row', 
            alignItems: `center`, 
            width: `100%`}}
          >
            <div className="col-left" style={{
              width: `25px`, 
              height: `25px`, 
              padding: `4px 0 0 0`, 
              margin: `0 auto`, 
              background: `rgb(241, 241, 241)`, 
              borderRadius: `100px`,
              textAlign: 'center', 
              color: 'white',
              fontSize: `0.8rem`, 
              fontWeight: 700 }}
            >
              { marker.business_name.split(' ').map(w=> w.charAt(0)).join('').length > 2 ?
              marker.business_name.split(' ').map(w=> w.charAt(0)).join('').toUpperCase().substr(0, 2):
              marker.business_name.split(' ').map(w=> w.charAt(0)).join('').toUpperCase()}
            </div>
            <div style={{width: `70%`, whiteSpace: `wrap`, margin: 0, color: 'black'}}>
              <h6 className="name" style={{fontSize: `0.6rem`, fontWeight: 700, margin: 0}}>{marker.business_name}</h6>
              <OpenTime
                styled={{fontSize: `0.5rem`, margin: `0`}}
                icon={false}
                hours={marker.opening_hours}
              />
            </div>
          </div>
        </div>
      );
  }
};