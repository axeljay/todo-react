class ListMaker extends React.Component {
  constructor() {
    super();
    this.state = {
      input: '',
      lists: [],
    };
  }

  changeHandler = event => {
    this.setState({ input: event.target.value });
  };

  clickHandler = event => {
    if (this.state.input.length >= 1) {
      this.setState({
        lists: [...this.state.lists, this.state.input],
        input: '',
      });
    }
  };

  render() {
    const lists = this.state.lists.map((list, index) => {
      return <List key={index} name={list} />;
    });
    return (
      <div className="container-fluid h-100">
        <h1 className="mx-auto">LIST MAKER 5000</h1>
        <div className="row mt-3">
          <div className="col-3">
            <input onChange={this.changeHandler} value={this.state.input} />
            <button className="btn btn-primary" onClick={this.clickHandler}>
              add list
            </button>
          </div>
          <div className="col-9">
            <div className="row">{lists}</div>
          </div>
        </div>
      </div>
    );
  }
}

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name,
      done: [],
      list: [],
      input: '',
      error: false,
    };
  }

  changeHandler = event => {
    const maxLength = 18;
    if (event.target.value.length <= maxLength) {
      this.setState({
        input: event.target.value,
        error: false,
      });
    } else this.setState({ error: (this.state.error = true) });
  };

  clickHandler = event => {
    if (this.state.input.length >= 1) {
      const task = {
        value: this.state.input,
        created: moment().format('DD MMM YY, HHmm'),
      };
      this.setState({
        list: [...this.state.list, task],
        input: '',
        error: false,
      });
    }
  };

  deleteItem = (value, isDone) => {
    let array;
    if (isDone) {
      array = [...this.state.done];
      array.splice(array.indexOf(value), 1);
      this.setState({ done: array });
    } else {
      array = [...this.state.list];
      array.splice(array.indexOf(value), 1);
      this.setState({ list: array });
    }
  };

  setDone = value => {
    this.deleteItem(value);
    this.setState({ done: [...this.state.done, value] });
  };

  render() {
    let errorMsg;
    if (this.state.error) {
      errorMsg = <p>Max character limit reached!</p>;
    }

    const listItems = this.state.list.map((item, index) => {
      return (
        <ListItem key={index} task={item} deleteItem={this.deleteItem} setDone={this.setDone} />
      );
    });

    const doneItems = this.state.done.map((item, index) => {
      return <ListItem key={index} task={item} deleteItem={this.deleteItem} isDone={true} />;
    });

    return (
      <div className="col-4 mb-5">
        <input onChange={this.changeHandler} value={this.state.input} />
        <button className="btn btn-primary" onClick={this.clickHandler}>
          add item
        </button>
        <h5>List {this.state.name}</h5>
        {errorMsg}
        <ul className="list-group">{listItems}</ul>
        <h5>Done</h5>
        <ul className="list-group">{doneItems}</ul>
      </div>
    );
  }
}

class ListItem extends React.Component {
  constructor() {
    super();
    this.doneButton;
  }
  deleteHandler = event => {
    this.props.deleteItem(this.props.task, this.props.isDone);
  };

  doneHandler = event => {
    this.props.setDone(this.props.task);
  };

  checkExpire = value => {
    let target = moment(value.created, 'DD MMM YY, HHmm');
    let now = moment();
    let difference = now.diff(target, 'seconds');

    if (difference >= 120) this.doneHandler();
  };

  componentDidUpdate() {
    if (!this.props.isDone) {
      this.checkExpire(this.props.task);
    }
  }

  render() {
    if (!this.props.isDone) {
      this.doneButton = (
        <button className="btn btn-small btn-success" onClick={this.doneHandler}>
          OK
        </button>
      );
    }
    return (
      <li className="list-group-item">
        {this.props.task.value}, {this.props.task.created}H<br />
        <button className="btn btn-danger btn-small" onClick={this.deleteHandler}>
          X
        </button>
        {this.doneButton}
      </li>
    );
  }
}

ReactDOM.render(<ListMaker />, document.getElementById('root'));
