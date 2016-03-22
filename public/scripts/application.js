var years = [
  {value: "freshman", alias: "2020"},
  {value: "sophomore", alias: "2019"},
  {value: "junior", alias: "2018"},
  {value: "senior", alias: "2017"},
  {value: "grad student", alias: "other"},
  {value: "high schooler", alias: "other"},
];

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
          id={this.props.value}
          style={{
            backgroundColor: background,
            listStyle: "none",
            paddingLeft: "10px"
          }}>
          {this.props.value}
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
    var re = new RegExp(this.props.re, "i");

    var list = this.props.list.map(function(item, i) {
      if (re.test(item.value) || re.test(item.alias)) {
        return <DropdownItem
                  key={i}
                  value={item.value}
                  onClick={itemClick} />
      }
      return
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
    this.setState({focus: false});
  },
  handleClick: function(e) {
    e.nativeEvent.stopImmediatePropagation();
  },
  handleChange: function(e) {
    this.setState({value: e.target.value});
    this.props.onChange(e, e.target.value);
  },
  handleFocus: function() {
    this.setState({focus: true});
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
  handleKeyDown: function(e) {
    e.nativeEvent.stopImmediatePropagation();
    switch(e.keyCode) {
      case 9: // tab key
      case 27: // escape key
        this.setState({focus: false});
        break;

      case 38: // up arrow
        if (this.state.selectedItem > 0) {
          this.setState({selectedItem: --this.state.selectedItem});
        }
        break;

      case 40: // down arrow
        if (this.state.selectedItem < this.props.options.length) {
          this.setState({selectedItem: ++this.state.selectedItem});
        }
        break;
    }
  },
  handleDropdownListClick: function(e) {
    this.setState({value: e.target.id});
    this.props.onChange(e, e.target.id);
    return;
  },
  render: function() {
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
          onChange={this.handleChange}
          onClick={this.handleClick}
          onFocus={this.handleFocus}
          onKeyDown={this.handleKeyDown}
          onTouchStart={this.handleFocus}
          onTouchEnd={this.handleBlur}
          style={{width: 'inherit'}}
        ></input>
        <DropdownList
          re={this.state.value}
          list={this.props.options}
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
  handleYearChange: function(e, value) {
    this.setState({year: value});
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
          <label htmlFor='year'>and I&rsquo;m a</label>
          <Dropdown
            id='year'
            type='text'
            placeholder='Year'
            value={this.state.year}
            onChange={this.handleYearChange}
            options={years}
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
