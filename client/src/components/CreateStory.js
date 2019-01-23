import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './CreateStory.css';
import AdsCard from './AdsCard';
import TextEditor from './reusable/TextEditor';

const INITIAL_TEXT = {
  content: "New Text",
  color: "white",
  x: 0,
  y: 50,
  align: 'left',
  font: "font-1",
  size: 1
};
const CommonInput = ({
  classname,
  type,
  name,
  label,
  labelfont,
  inputfont,
  placeholder,
  onchange,
  onfocus,
  onblur,
  value,
  removebtn
}) => (
  <div className={classname}>
    <span 
      className={labelfont? `cm-lb-1 ${labelfont}`:`cm-lb-1`}
    >
      {label}
    </span>
    <input 
      type={type?type:"text"}
      name={name}
      className={inputfont? `cm-inp-1 ${inputfont}`:`cm-inp-1`} 
      placeholder={placeholder} 
      onChange={onchange}
      onFocus={onfocus}
      onBlur={onblur}
      value={value}/>
    { removebtn && removebtn }
  </div>
);
const PositionControl = ({
  obj,
  onChangePositionX,
  onChangePositionY,
  onAlignLeft,
  onAlignCenter,
  onAlignRight
}) => (
  <div className="position-ctrl">
    <span className="arrows"><FontAwesomeIcon icon="arrows-alt-h"/></span>
    <input className="cm-inp-rg" type="range" 
      onChange={onChangePositionX} 
      min="0" 
      max="100" 
      value={obj.x}/>
    <span className="arrows"><FontAwesomeIcon icon="arrows-alt-v"/></span>
    <input className="cm-inp-rg" type="range" 
      onChange={onChangePositionY} 
      min="0" 
      max="100" 
      value={obj.y}/>
    <div className="text-alignment">
      <span className={obj.align === 'left'? 'font-style selected':'font-style'} 
        onClick={onAlignLeft}><FontAwesomeIcon icon="align-left"/></span>
      <span className={obj.align === 'center'? 'font-style selected':'font-style'} 
        onClick={onAlignCenter}><FontAwesomeIcon icon="align-center"/></span>
      <span className={obj.align === 'right'? 'font-style selected':'font-style'} 
        onClick={onAlignRight}><FontAwesomeIcon icon="align-right"/></span>
    </div>
  </div>
);
class CreateStory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: {
        content: "We are United: Beer Party!",
        color: "white",
        x: 0,
        y: 30,
        align: 'left',
        font: "font-2",
        fontweight: false,
        fontstyle: false,
        textdeco: false,
        size: 0.9
      },
      subtitle: {
        content: "with Spacial Guest: Anthony Martial",
        color: "white",
        x: 0,
        y: 42,
        align: 'left',
        font: "font-7",
        fontweight: false,
        fontstyle: false,
        textdeco: false,
        size: 1.5
      },
      texts: [{
        content: "and Ander Herrera",
        color: "white",
        x: 0,
        y: 55,
        align: 'left',
        font: "font-2",
        fontweight: false,
        fontstyle: false,
        textdeco: false,
        size: 1
      },
      {
        content: "and Ander Herrera",
        color: "white",
        x: 0,
        y: 80,
        align: 'left',
        font: "font-3",
        fontweight: false,
        fontstyle: false,
        textdeco: false,
        size: 0.6
      }],
      url: "/images/img-05.jpg",
      template: "square",
      fit: true,
      viewed: false,
      extendEditor: ""
    }
  }
  onChange(e) {
    e.preventDefault();
    var target = this.state[e.target.name];
    target.content = e.target.value;
    this.setState({ [e.target.name]: target });
  }
  onChangeText(e,i) {
    e.preventDefault();
    var { texts } = this.state;
    texts[i].content = e.target.value;
    this.setState({ texts: texts });
  }
  onChangePosition(e,axis,target) {
    var { texts } = this.state;
    var text = typeof target === 'number' ? texts[target] : this.state[target];
    if (axis.toLowerCase() === "x") {
      text.x = e.target.value;
      this.setState({ texts: texts });
    } else {
      text.y = e.target.value;
      this.setState({ texts: texts });
    }
  }
  onAddText(e) {
    e.preventDefault();
    var { texts } = this.state;
    texts.push({...INITIAL_TEXT});
    this.setState({ texts: texts });
  }
  onRemoveText(e,i) {
    e.preventDefault();
    var { texts } = this.state;
    texts.splice(i,1);
    this.setState({ texts: this.state.texts })
  }
  onFocus(e,target) {
    this.setState({ extendEditor: target });
  }
  //font control
  onChangeFontWeight(e, target) {
    e.preventDefault();
    var { texts } = this.state;
    var text;
    if (typeof target === 'number') {
      text = texts[target];
      text.fontweight = !text.fontweight;
      this.setState({texts: texts})
    } else {
      text = this.state[target];
      text.fontweight = !text.fontweight;
      this.setState({[target]: text});
    }
  }
  onChangeFontStyle(e, target) {
    e.preventDefault();
    var { texts } = this.state;
    var text;
    if (typeof target === 'number') {
      text = texts[target];
      text.fontstyle = !text.fontstyle;
      this.setState({texts: texts})
    } else {
      text = this.state[target];
      text.fontstyle = !text.fontstyle;
      this.setState({[target]: text});
    }
  }
  
  onChangeTextDeco(e, target) {
    e.preventDefault();
    var { texts } = this.state;
    var text;
    if (typeof target === 'number') {
      text = texts[target];
      text.textdeco = !text.textdeco;
      this.setState({texts: texts})
    } else {
      text = this.state[target];
      text.textdeco = !text.textdeco;
      this.setState({[target]: text});
    }
  }
  onChangeFontType(e, target) {
    var { texts } = this.state;
    var text;
    if (typeof target === 'number') {
      text = texts[target];
      text.font = e.target.value;
      this.setState({texts: texts})
    } else {
      text = this.state[target];
      text.font = e.target.value;
      this.setState({[target]: text});
    }
  }
  onChangeFontSize(e, target) {
    e.preventDefault();
    var { texts } = this.state;
    var text;
    var value = (e.target.value / 100) + 0.5;
    if (typeof target === 'number') {
      text = texts[target];
      text.size = value;
      this.setState({texts: texts})
    } else {
      text = this.state[target];
      text.size = value;
      this.setState({[target]: text});
    }
  }
  onChangeAlignment(e, alignment, target) {
    e.preventDefault();
    var { texts } = this.state;
    var text;
    if (typeof target === 'number') {
      text = texts[target];
      text.align = text.align === alignment ? 'left' : alignment;
      this.setState({texts: texts})
    } else {
      text = this.state[target];
      text.align = text.align === alignment ? 'left' : alignment;
      this.setState({[target]: text});
    }
  }
  render() {
    const { title, subtitle, texts, url, template, fit, extendEditor } = this.state;
    const textInputs = this.state.texts && this.state.texts.map((text, index) => (
      <div key={index} className={extendEditor === index ?"text-editor extended":"text-editor"}>
        <CommonInput
          classname="mb-1"
          name={index}
          label={`Text ${index+1}`}
          inputfont="font-2"
          placeholder={`Text ${index+1}`}
          onchange={(e)=>this.onChangeText(e,index)}
          onfocus={(e)=>this.onFocus(e,index)}
          value={text.content}
          removebtn={
            <FontAwesomeIcon 
              icon="trash-alt" 
              className="remove-text-icon" 
              onClick={(e)=>this.onRemoveText(e,index)} 
            />}
        />
        <TextEditor
          textobj={text}
          onChangeFontType={(e)=>this.onChangeFontType(e,index)}
          onChangeFontSize={(e)=>this.onChangeFontSize(e,index)}
          onChangeFontStyle={(e)=>this.onChangeFontStyle(e,index)}
          onChangeFontWeight={(e)=>this.onChangeFontWeight(e,index)}
          onChangeTextDeco={(e)=>this.onChangeTextDeco(e,index)}
        />
        <PositionControl
          obj={text}
          onChangePositionX={(e)=>this.onChangePosition(e,'x',index)}
          onChangePositionY={(e)=>this.onChangePosition(e,'y',index)}
          onAlignLeft={(e)=>this.onChangeAlignment(e,'left',index)}
          onAlignCenter={(e)=>this.onChangeAlignment(e,'center',index)}
          onAlignRight={(e)=>this.onChangeAlignment(e,'right',index)}
        />
      </div>
    ));
    return (
      <div className={this.props.mainclass}>
        <div className="story-form">
          <div className="text-fields">
            <h4 className="board-head pt-3 pb-2 ul-1">
              <FontAwesomeIcon icon="edit" style={{color: 'rgb(22, 214, 102)'}} className="mr-2"/>
              Create New Story
            </h4>
            <div className="text-fields-ctrl">
              <h6 className="text-fields-label">Header Texts</h6>
              <div className={extendEditor === "title"?"text-editor extended":"text-editor"}>
                <CommonInput
                  classname="mb-1"
                  name="title"
                  label="Title"
                  inputfont="font-2"
                  placeholder="Title"
                  onchange={(e)=>this.onChange(e)}
                  onfocus={(e)=>this.onFocus(e,"title")}
                  value={title.content}
                />
                <TextEditor
                  textobj={title}
                  onChangeFontType={(e)=>this.onChangeFontType(e,'title')}
                  onChangeFontSize={(e)=>this.onChangeFontSize(e,'title')}
                  onChangeFontStyle={(e)=>this.onChangeFontStyle(e,'title')}
                  onChangeFontWeight={(e)=>this.onChangeFontWeight(e,'title')}
                  onChangeTextDeco={(e)=>this.onChangeTextDeco(e,'title')}
                />
                <PositionControl
                  obj={title}
                  onChangePositionX={(e)=>this.onChangePosition(e,'x','title')}
                  onChangePositionY={(e)=>this.onChangePosition(e,'y','title')}
                  onAlignLeft={(e)=>this.onChangeAlignment(e,'left','title')}
                  onAlignCenter={(e)=>this.onChangeAlignment(e,'center','title')}
                  onAlignRight={(e)=>this.onChangeAlignment(e,'right','title')}
                />
              </div>
              <div className={extendEditor === "subtitle"?"text-editor extended":"text-editor"}>
                <CommonInput
                  classname="mb-1"
                  name="subtitle"
                  label="Sub Title"
                  inputfont="font-2"
                  placeholder="Sub title"
                  onchange={(e)=>this.onChange(e)}
                  onfocus={(e)=>this.onFocus(e,"subtitle")}
                  value={subtitle.content}
                />
                <TextEditor
                  textobj={subtitle}
                  onChangeFontType={(e)=>this.onChangeFontType(e,'subtitle')}
                  onChangeFontSize={(e)=>this.onChangeFontSize(e,'subtitle')}
                  onChangeFontStyle={(e)=>this.onChangeFontStyle(e,'subtitle')}
                  onChangeFontWeight={(e)=>this.onChangeFontWeight(e,'subtitle')}
                  onChangeTextDeco={(e)=>this.onChangeTextDeco(e,'subtitle')}
                />
                <PositionControl
                  obj={subtitle}
                  onChangePositionX={(e)=>this.onChangePosition(e,'x','subtitle')}
                  onChangePositionY={(e)=>this.onChangePosition(e,'y','subtitle')}
                  onAlignLeft={(e)=>this.onChangeAlignment(e,'left','subtitle')}
                  onAlignCenter={(e)=>this.onChangeAlignment(e,'center','subtitle')}
                  onAlignRight={(e)=>this.onChangeAlignment(e,'right','subtitle')}
                />
              </div>
            </div>
            <div className="text-fields-ctrl">
              <h6 className="text-fields-label">
                Additional Texts
              </h6>
              { textInputs }
              <span 
                className="small-info"
                onClick={(e)=> this.onAddText(e)}
              >
                New text
                <FontAwesomeIcon icon="plus" className="add-icon" />
              </span>
            </div>
          </div>
          <div 
            className={this.state.viewed?`poster-display viewed`:"poster-display"}
            // onClick={()=>this.setState({viewed: !this.state.viewed})}
          >
            <AdsCard
              adsId={'ads-view'}
              classname={template}
              imgclass={fit?"fit-height":"fit-width"}
              src={url}
              alt="sample"
              title={title}
              subtitle={subtitle}
              // color={`wh`}
              texts={texts}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default CreateStory;