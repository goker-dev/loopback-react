import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {fetchUsers} from '../../actions';
import Pagination from "../Common/Pagination";
import History from "../../history";
import {Input} from "reactstrap";

class List extends Component {

  constructor(props) {
    super(props);
    const params = new URLSearchParams(props.location.search);
    const search = params.get('search') || '';
    const page = params.get('page') || 1;
    this.state = {
      me: props.me,
      count: 0,
      page,
      limit: 10,
      range: 10,
      items: [],
      query: search,
      search: search,
      filteredItems: false,
    }
  }

  componentDidMount() {
    if (!this.state.me)
      return History.push('/signin');
    console.log('componentDidMount', this.state);
    if (this.state.query) {
      const filter = {skip: Math.max(0, this.state.page - 1) * this.state.limit, limit: this.state.limit};
      this.props.fetchList({query: this.state.query, filter});
    } else {
      this.props.fetchList();
    }
  }

  componentDidUpdate(props) {
    const params = new URLSearchParams(props.location.search);
    const search = params.get('search') || '';
    const page = params.get('page') || 1;
    console.log('componentDidUpdate', props);

    if (page !== this.state.page) {
      console.log('page', props);
      const filter = {skip: Math.max(0, page - 1) * this.state.limit, limit: this.state.limit};
      this.setState({page: page});
      this.props.fetchList({query: this.state.query, filter});
    } else if (search !== this.state.search) {
      console.log('search', props);
      this.setState({search});
      this.props.fetchList({query: search});
    }

    if (props.data && props.data.items) {
      this.setState({
        isLoading: false,
        count: props.data.count,
        items: props.data.items,
        filteredItems: false
      });
    }
  }

  handleFilter = (e) => {
    e.preventDefault();
    console.log(e.currentTarget.value);
    const query = e.currentTarget.value.toLowerCase();
    const filteredItems = this.state.items.filter(item => {
      console.log({item});
      return (item.name.toLowerCase().indexOf(query) > -1 || item.surname.toLowerCase().indexOf(query) > -1
        || item.username.toLowerCase().indexOf(query) > -1 || item.email.toLowerCase().indexOf(query) > -1)
    });
    this.setState({query, filteredItems});
  };

  handleSearch = (e) => {
    e.preventDefault();
    console.log(e.key);
    if (e.key === 'Enter')
      return History.push('?search=' + this.state.query);
  };

  renderItems() {
    return (this.state.filteredItems || this.state.items).map(user => {
      return <div className="col-sm-4" key={user.id}>
        <div className="card mb-2">
          <div className="card-body p-2">
            <img className="img-thumbnail rounded-circle float-left mr-2"
                 src={user.image.thumb} alt={user.name}
                 width="100"
            />
            <div className="">
              <h3 className="h5 card-title">
                <i className={user.icon}/>&nbsp;&nbsp;{user.username}</h3>
              <p>
                <small>{user.name} {user.surname}</small>
              </p>
              <div className="text-right">
                <Link to={user.username} className="btn btn-sm btn-primary">PROFILE</Link>
                {(this.props.me.isAdmin || this.props.me.isEditor) &&
                <Link to={'/users/edit/' + user.id} className="btn btn-sm btn-success ml-1">EDIT</Link>}
              </div>
            </div>
          </div>
        </div>
      </div>;
    })
  }

  render() {
    if (!this.state.items) {
      return <div>Loading...</div>;
    }
    return (<React.Fragment>
        <div className="list">
          <div className="searchInput text-right pr-4">
            <Input type="text" className="form-control-sm" placeholder="Filter or Search..." value={this.state.query}
                   onKeyUp={this.handleSearch} onChange={this.handleFilter}/>
            <small className="text-muted">Total result: {this.state.count}</small></div>
          <div className="row">
            {this.renderItems()}
          </div>
          {this.state.count &&
          <Pagination page={this.state.page} count={this.state.count}
                      limit={this.state.limit} range={this.state.range}
                      query={{search: this.state.search}}/>}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {me: state.auth.me, data: state.system.data}
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchList: (params) => {
      dispatch(fetchUsers(params));
    },
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(List);
