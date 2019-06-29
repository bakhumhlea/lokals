import React, { Component } from 'react'
import { connect } from 'react-redux';
// import { isEmpty } from '../../util/is-empty';
import './BasicInfo.css'
import SwitchInputField from '../../reusable/SwitchInputField';
import ToggleBtn from '../../reusable/ToggleBtn';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { fab } from '@fortawesome/free-brands-svg-icons'
import { faInfoCircle, faAddressBook, faUserTie, faMoneyBillWave, faClipboardList, faCreditCard } from '@fortawesome/free-solid-svg-icons'
import { updateBusinessProfile } from '../../../actions/businessAction';
import DisplayTags from './DisplayTags';
import ToggleInput from './ToggleInput';
import PaymentField from './PaymentField';

library.add(faInfoCircle, faAddressBook, faUserTie, faMoneyBillWave, faClipboardList, faCreditCard)
class BasicInfo extends Component {
  state = {
    editmode: null,
  };
  onClickEditSave(sectionname) {
    const { data } = this.props;
    const { editmode } = this.state;
    if (editmode !== sectionname) {
      this.setState({ editmode: sectionname })
    } else {
      this.props.updateBusinessProfile(data);
      this.setState({ editmode: null })
    }
  }
  render() {
    const { data, onchange, onAddToArray, onRemoveFromArray, onToggleValue } = this.props;
    const { editmode } = this.state;
    // Object.entries(data).map(entry => console.log(`${entry}`));
    // console.log(data);
    return (
      <div className="dashboard-section">
          <div className="float-card profile-board">
            <div className="section-bound top-part">
              <div className="business-icon">
                AC
              </div>
              <SwitchInputField
                name="business_name"
                classname="business_name"
                editmode={editmode==='info'}
                data={data.business_name}
                focus={true}
                onchange={(e,key) => onchange(e,key)}
              />
              <SwitchInputField
                name="business_type"
                classname="business_type"
                editmode={editmode==='info'}
                data={data.business_type}
                onchange={(e,key) => onchange(e,key)}
                focus={true}
              />
              <div className="btn-set">
                <ToggleBtn
                  mode={editmode==='info'}
                  ontoggle={()=>this.onClickEditSave('info')}
                  button1={(<span><FontAwesomeIcon icon="edit" /> Quick Edit</span>)}
                  button2={(<span><FontAwesomeIcon icon="save" /> Save Change</span>)}
                />
              </div>
            </div>
            <div className="section-bound mid-part">
              <SwitchInputField
                labelcomp={(<p className="basic-info-label">
                  <FontAwesomeIcon icon="info-circle" className="label-icon"/>About</p>)}
                name="about"
                classname="common about"
                editmode={editmode==='info'}
                data={data.about}
                onchange={(e,key) => onchange(e,key)}
                textarea={true}
              />
            </div>
            <div className="section-bound">
              <SwitchInputField
                labelcomp={(<p className="basic-info-label">
                  <FontAwesomeIcon icon="address-book" className="label-icon"/>Address
                </p>)}
                name="formatted_address"
                classname="common"
                editmode={editmode==='info'}
                data={data.formatted_address}
                onchange={(e,key) => onchange(e,key)}
                focus={false}
                textarea={true}
              />
              <DisplayTags
                name="cuisines" 
                data={data.cuisines}
                objkey={'tag'}
                sectionclass="switch-input-field common"
                containerclass="basic-info"
                labelcomp={(<p className="basic-info-label">
                  <FontAwesomeIcon icon="utensils" className="label-icon"/>Cuisines
                </p>)}
                editmode={editmode==='info'}
                onclickadd={(e,data)=>onAddToArray(e,data,'tag')}
                onclickremove={(data)=>onRemoveFromArray('cuisines',data,'tag')}
                selectoptions={['american','burmese','chinese','french','german','indian','indonesian','italian','japanese','korean','thai']}
              />
              <SwitchInputField
                labelcomp={(<p className="basic-info-label">
                  <FontAwesomeIcon icon="user-tie" className="label-icon"/>Dining style</p>)}
                name="dining_style"
                classname="common"
                editmode={editmode==='info'}
                data={data.dining_style}
                onchange={(e,key) => onchange(e,key)}
                focus={false}
              />
              <SwitchInputField
                labelcomp={(<p className="basic-info-label">
                  <FontAwesomeIcon icon="money-bill-wave" className="label-icon"/>Price range</p>)}
                name="price_range"
                classname="common"
                editmode={editmode==='info'}
                data={data.price_range}
                onchange={(e,key) => onchange(e,key)}
                focus={false}
              />
              {data.reservation && 
                (<ToggleInput
                  name="reservation"
                  classname="common"
                  editmode={editmode==='info'}
                  data={data.reservation}
                  datakey={['available','note']}
                  ontoggle={(value) => onToggleValue(value, "reservation", 'available' )}
                  onchange={(e,key) => onchange(e,key)}
                />)}
              <PaymentField
                name="payment_options" 
                data={data.payment_options}
                objkey={'payment_type'}
                sectionclass="switch-input-field common"
                containerclass="basic-info"
                labelcomp={(<p className="basic-info-label">
                <FontAwesomeIcon icon="credit-card" className="label-icon"/>Payment options</p>)}
                editmode={editmode==='info'}
                onclickadd={(e,data)=>onAddToArray(e,data,'payment_type')}
                onclickremove={(data)=>onRemoveFromArray('payment_options',data,'payment_type')}
                selectoptions={['cash','visa','mastercard','jcb','discover','diners-club','amex','apple-pay','amazon-pay']}
              />
            </div>
          </div>
      </div>
    )
  }
}

export default connect( null, { updateBusinessProfile } )(BasicInfo);