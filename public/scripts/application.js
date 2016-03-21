var DropdownItem = React.createClass({
  getInitialState: function() {
    return {
      focus: false
    };
  },
  handleMouseOver: function() {
    this.setState({focus: true});
    return;
  },
  handleMouseLeave: function() {
    this.setState({focus: false});
    return;
  },
  render: function() {
    var background = this.state.focus ? "blue" : "white";

    return (
        <li
          className='dropdown-item'
          onMouseOver={this.handleMouseOver}
          onMouseLeave={this.handleMouseLeave}
          onClick={this.props.onClick}
          value={this.props.value}
          style={{
            backgroundColor: background,
            listStyle: "none",
            paddingLeft: "10px"
          }}>
          {this.props.text}
        </li>
    )
  }
});

var DropdownList = React.createClass({
  getInitialState: function() {
    return {};
  },
  render: function() {
    var itemClick = this.props.onClick;

    var list = this.props.list.map(function(item, i) {
      return <DropdownItem
                key={i}
                text={item.text}
                value={item.value}
                onClick={itemClick} />
    });

    var show = this.props.display ? "block" : "none";
    return (
      <ul
        className='dropdown-list'
        style={{
          position: 'absolute',
          width: 'inherit',
          backgroundColor: 'white',
          overflow: 'scroll',
          height: '60px',
          marginTop: "0",
          display: show
        }}>
        {list}
      </ul>
    );
  }
});

var Dropdown = React.createClass({
  getInitialState: function() {
    return {
      focus: false,
      selectedItem: 0
    };
  },
  componentDidMount: function() {
    document.addEventListener("click", this.documentClickHandler);
  },
  componentWillUnmount: function() {
    document.removeEventListener("click", this.documentClickHandler);
  },
  documentClickHandler: function() {
    console.log('asd')
    this.setState({focus: false});
  },
  handleClick: function(e) {
    e.nativeEvent.stopImmediatePropagation();
  },
  handleFocus: function() {
    this.setState({focus: true});
    return;
  },
  handleBlur: function() {
    this.setState({focus: false});
    return;
  },
  handleFocus: function() {
    this.setState({focus: true});
    return;
  },
  handleBlur: function() {
    this.setState({focus: false});
    return;
  },
  handleDropdownListClick: function(e) {
    this.setState({value: e.target.value});
    this.props.onChange(e);
    return;
  },
  render: function() {
    var list = [
      {text: "freshman", value: 2020},
      {text: "sophomore", value: 2019},
      {text: "junior", value: 2018},
      {text: "senior", value: 2017}
    ];

    return (
      <div
        className='dropdown'
        style={{display: 'inline-block'}}>
        <input
          id={this.props.id}
          className='dropdown-input'
          type={this.props.type}
          placeholder={this.props.placeholder}
          value={this.state.value}
          onChange={this.props.onChange}
          onClick={this.handleClick}
          onFocus={this.handleFocus}
          // onBlur={this.handleBlur}
          onTouchStart={this.handleFocus}
          onTouchEnd={this.handleBlur}
          style={{width: 'inherit'}}
        ></input>
        <DropdownList
          list={list}
          display={this.state.focus}
          onClick={this.handleDropdownListClick}/>
      </div>
    );
  }
});

var Application = React.createClass({
  getInitialState: function() {
    return {
      firstName: '',
      lastName: '',
      year: '',
      school: '',
      email: ''
    }
  },
  rawMarkup: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return { __html: rawMarkup };
  },
  handleFirstNameChange: function(e) {
    this.setState({firstName: e.target.value});
  },
  handleLastNameChange: function(e) {
    this.setState({lastName: e.target.value});
  },
  handleYearChange: function(e) {
    this.setState({year: e.target.value});
  },
  handleSchoolChange: function(e) {
    this.setState({school: e.target.value});
  },
  handleEmailChange: function(e) {
    this.setState({email: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var firstName = this.state.firstName.trim(),
        lastName = this.state.lastName.trim(),
        year = this.state.year,
        school = this.state.school.trim(),
        email = this.state.email.trim();

    var app = {
        firstName: firstName,
        lastName: lastName,
        year: year,
        school: school,
        email: email,
        id: Date.now()
      };

    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: app,
      success: function(data) {
        console.log('success');
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <label htmlFor='first-name'>My name is</label>
          <input
            id='first-name'
            type='text'
            placeholder='First'
            value={this.state.firstName}
            onChange={this.handleFirstNameChange}
            required></input>
          <input
            id='last-name'
            type='text'
            placeholder='Last'
            value={this.state.lastName}
            onChange={this.handleLastNameChange}
            required></input>
        </div>
        <div>
          <label htmlFor='year'>And I&rsquo;m a</label>
          <Dropdown
            id='year'
            type='text'
            placeholder='Year'
            value={this.state.year}
            onChange={this.handleYearChange}
            required/>
        </div>
        <div>
          <label htmlFor='school'>at</label>
          <input
            id='school'
            type='text'
            placeholder='School'
            value={this.state.school}
            onChange={this.handleSchoolChange}
            required></input>
        </div>
        <div>
          <label htmlFor='email'>My email is</label>
          <input
            id='email'
            type='email'
            placeholder='Email'
            value={this.state.email}
            onChange={this.handleEmailChange}
            required></input>
        </div>
        <button type='submit'>And that&rsquo;s all I have to say about that</button>
      </form>
    );
  }
});


ReactDOM.render(
  <Application url="/api/applications" pollInterval={2000}/>,
  document.getElementById('application-container')
);
