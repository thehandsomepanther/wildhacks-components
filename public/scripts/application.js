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
          <select
            id='year'
            value={this.state.year}
            onChange={this.handleYearChange}
            required>
            <option value=''>year</option>
            <option value='2020'>freshman</option>
            <option value='2019'>sophomore</option>
            <option value='2018'>junior</option>
            <option value='2017'>senior</option>
            <option value='other'>other</option>
          </select>
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
