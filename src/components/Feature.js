import React, { Component} from "react";

class Feature extends Component {
  
  constructor(props) {
    super(props);
    
  }
  

  render()
  {
    return (
      <div>This is Feature.js. Only authenticated Users allowed.</div>
    );
  }
}

export default Feature;
