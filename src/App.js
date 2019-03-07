import React, { Component } from 'react';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      username: '',
      data: [],
      PageSize: 15,
      Page: 1,
      submitdata: '',
      RenderView: false,
      ViewData: [],
      nameUrl: [],
      view: "view"
    })
  }
  changeUserSearch = (e) => {
    this.setState({
      username: e.target.value
    })

  }
  onSubmit = (e) => {
    this.setState({
      submitdata: this.state.username
    })
    e.preventDefault();
  }
  NextPage = () => {
    this.setState({
      Page: this.state.Page + 1
    })
  }
  PreviousPage = () => {
    this.setState({
      Page: this.state.Page - 1
    })
  }

  ViewRateStar = (e) => {
    // console.log(e.target.name);
    this.setState({
      RenderView: true,
      nameUrl: e.target.name
    });
  }
  componentDidMount = () => {
    var url = "https://api.github.com/users/" + this.state.submitdata + "/repos?page=" + this.state.Page + "&per_page=" + this.state.PageSize
    fetch(url).then(data => {
      if (data.status === 200) {
        return data.json();
      }

    }).then(jsonStr => {
      this.setState({
        data: jsonStr
      })
    })

  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.state.submitdata !== prevState.submitdata || this.state.Page !== prevState.Page) {
      fetch("https://api.github.com/users/" + this.state.submitdata + "/repos?page=" + this.state.Page + "&per_page=" + this.state.PageSize)
        .then(data => {
          if (data.status === 200) {
            return data.json();
          }

        })
        .then(jsonStr => {
          this.setState({
            data: jsonStr
          })
        })
    }
    if (this.state.RenderView !== prevState.RenderView) {
      fetch(this.state.nameUrl)
        .then(data => {
          if (data.status === 200) {
            return data.json();
          }
        }).then(
          data => {
            this.setState({
              ViewData: data,
              RenderView: false
            })
          }
        )

    }
  }
  render() {


    const ViewData = typeof this.state.ViewData !== 'undefined' ?
      this.state.ViewData.map(
        (data, index) =>

          <tr key={index}>
            <td>
              {data.login}
            </td>
          </tr>
      ) : <tr style={{ marginLeft: "23px" }} >
        <td>
          Can't find View data</td>
      </tr>

    const RenderData = typeof this.state.data !== 'undefined' ?

      this.state.data.map(
        (data, index) => {
          // console.log(data);
          return (
            <tr key={index} >
              <td>
                {data.name}
              </td>
              <td>
                ({this.state.click}/{data.stargazers_count})
              </td>
              <td>
                <input style={{backgroundColor:"transparent",  border : "2px solid black", }} name={data.stargazers_url} type="button" onClick={this.ViewRateStar} value="View" />
              </td>
            </tr>
          )
        }) :
      <tr style={{ marginLeft: "23px" }} >
        <td>   Can't find data</td>
      </tr>

    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <input style={styleInput} value={this.state.username} onChange={this.changeUserSearch} />
          <button type="submit">Search</button>
        </form>

        <table style={styleTable} >
          <tbody style={{float: "left"}}>
            {RenderData}
           
          </tbody>
          <tbody style={{float: "right"}}>
            {ViewData}
          </tbody>
        </table>

        {/* <table style={styleTable}>
          <tbody>
            {ViewData}
          </tbody>
        </table> */}

        <div style={{ display: "inline-block" }}>

          <button onClick={this.PreviousPage} style={stypeButtonLeft}>Previous</button>
          <button onClick={this.NextPage} style={styleButtonRight}>Next</button>

        </div>
      </div>
    );
  }
}
const styleTable = {
  fontSize: "13px",
  width: "400px",
  marginLeft: "23px",
  marginBottom: "10px",
  marginTop: "10px"
}

const styleInput = {
  width: "339px",
  display: "inline-block",
  marginLeft: "23px"
}

const stypeButtonLeft = {
  float: "left",
  marginRight: "289px",
  marginLeft: "23px"
};

const styleButtonRight = {
  float: "right"
}



export default App;
