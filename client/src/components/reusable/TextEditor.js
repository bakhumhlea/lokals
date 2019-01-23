import React, { Component } from 'react'
import { fonts } from '../../constants/fonts';

class TextEditor extends Component {
  render() {
    const { textobj } = this.props;
    const { onChangeFontType ,onChangeFontSize, onChangeFontStyle, onChangeFontWeight, onChangeTextDeco } = this.props;
    return (
      <div className="font-ctrl">
        <div className="type-selection">
          <select name="fonttype" value={textobj.font} onChange={onChangeFontType}>
            {fonts && fonts.map((font,index)=>(
              <option key={index} className={font.class} value={font.class}>{font.name}</option>
            ))}
          </select>
        </div>
        <div className="size-range">
          <span className="font-7"><small>A</small></span>
          <input className="cm-inp-rg" type="range" value={(textobj.size - 0.5) * 100 } min="0" max="100" onChange={onChangeFontSize} />
          <span className="font-7">A</span>
        </div>
        <div className="style-selection font-2">
          <span className={`font-style bo ${textobj.fontweight && 'selected'}`} 
            onClick={onChangeFontWeight}>B</span>
          <span className={`font-style it ${textobj.fontstyle && 'selected'}`} 
            onClick={onChangeFontStyle}>I</span>
          <span className={`font-style ul ${textobj.textdeco && 'selected'}`} 
            onClick={onChangeTextDeco}>U</span>
        </div>
      </div>
    )
  }
}

export default TextEditor;
