import React from 'react'
import Select from 'react-select'



export default class itemSelect extends React.Component {
  constructor(props){
    super(props)
    
  }


  onKeyDown = (event) => {
    
  }

  render() {
    var items = this.props.items
    
    var selectOptions = items.map(function(a) {
      return { value : a.name, label : a.name}
    })

    return (
      <Select options={selectOptions} onChange={this.handleSelectChange}/>
    )
  }

}
