var Input = React.createClass({
  getInitialState: function() {
    return {
      clean: true
    }
  },
  handleChange: function(e) {
    this.setState({clean: false});
    this.props.onChange(e);
  },
  render: function() {
    var inputClass = "input "
    inputClass += this.state.clean ? "clean " : "dirty ";
    inputClass += this.props.valid ? "valid" : "invalid";

    return (
      <input
        className={inputClass}
        id={this.props.id}
        type={this.props.type}
        placeholder={this.props.placeholder}
        value={this.props.value}
        valid={this.props.valid}
        onChange={this.handleChange}
        onClick={this.props.onClick}
        onFocus={this.props.onFocus}
        onKeyDown={this.props.onKeyDown}
        onTouchStart={this.props.onTouchStart}
        onTouchEnd={this.props.handleBlur} >
      </input>
    )
  }
});

var UserInput = React.createClass({
  getInitialState: function() {
    return {
      focus: false,
      valid: true
    };
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
  render: function() {

    if (this.props.re) {
      var re = new RegExp(this.props.re, "i");
      this.state.valid = re.test(this.state.value)
    }

    return(
      <div className="userinput">
        <Input
          id={this.props.id}
          type={this.props.type}
          placeholder={this.props.placeholder}
          value={this.state.value}
          valid={this.state.valid}
          onChange={this.handleChange}
          onClick={this.handleClick}
          onFocus={this.handleFocus}
          onKeyDown={this.handleKeyDown}
          onTouchStart={this.handleFocus}
          onTouchEnd={this.handleBlur}
        />
      </div>
    )
  }
});

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
    var dropdownItemClass = "dropdown-item "
    dropdownItemClass += this.state.focus ? "focus" : "";

    return (
        <li
          className={dropdownItemClass}
          onMouseOver={this.handleMouseOver}
          onMouseLeave={this.handleMouseLeave}
          onClick={this.props.onClick}
          id={this.props.value}
          style={{
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
    var that = this;
    var re = new RegExp(this.props.re, "i");

    var list = this.props.list.map(function(item, i) {
      if (re.test(item.value) || re.test(item.alias)) {
        return <DropdownItem
                  key={i}
                  value={item.value}
                  onClick={that.props.onClick} />
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
      selectedItem: 0,
      valid: this.props.custom
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
    if (!this.props.custom) {
      for (var key in this.props.options) {
        if(this.props.options[key].value == this.state.value) {
          this.state.valid = true;
          break;
        } else {
          this.state.valid = false;
        }
      }
    }

    return (
      <div className='dropdown' >
        <Input
          id={this.props.id}
          type={this.props.type}
          placeholder={this.props.placeholder}
          value={this.state.value}
          valid={this.state.valid}
          onChange={this.handleChange}
          onClick={this.handleClick}
          onFocus={this.handleFocus}
          onKeyDown={this.handleKeyDown}
          onTouchStart={this.handleFocus}
          onTouchEnd={this.handleBlur}
        />
        <DropdownList
          re={this.state.value}
          list={this.props.options}
          display={this.state.focus}
          onClick={this.handleDropdownListClick}
        />
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
  handleSchoolChange: function(e, value) {
    this.setState({school: value});
  },
  handleEmailChange: function(e) {
    this.setState({email: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();

    var app = {
        firstName: this.state.firstName.trim(),
        lastName: this.state.lastName.trim(),
        year: this.state.year,
        school: this.state.school,
        email: this.state.email.trim()
      };

      console.log(app)

    // $.ajax({
    //   url: this.props.url,
    //   dataType: 'json',
    //   type: 'PUT',
    //   data: app,
    //   success: function(data) {
    //     console.log('success');
    //   }.bind(this),
    //   error: function(xhr, status, err) {
    //     console.error(this.props.url, status, err.toString());
    //   }.bind(this)
    // });
  },

  render: function() {
    return (
      <form
        onSubmit={this.handleSubmit}
        className="application" >
        <div>
          <label htmlFor='first-name'>My name is</label>
          <UserInput
            id='first-name'
            type='text'
            placeholder='First'
            value={this.state.firstName}
            onChange={this.handleFirstNameChange}
            required />
          <UserInput
            id='last-name'
            type='text'
            placeholder='Last'
            value={this.state.lastName}
            onChange={this.handleLastNameChange}
            required />
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
            custom={false}
            required/>
        </div>
        <div>
          <label htmlFor='school'>at</label>
          <Dropdown
            id='school'
            type='text'
            placeholder='School'
            value={this.state.school}
            onChange={this.handleSchoolChange}
            options={colleges}
            custom={true}
            required />
        </div>
        <div>
          <label htmlFor='email'>My email is</label>
          <UserInput
            id='email'
            className='input-text'
            type='email'
            placeholder='Email'
            value={this.state.email}
            onChange={this.handleEmailChange}
            re='.*@.*\..*'
            required />
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
