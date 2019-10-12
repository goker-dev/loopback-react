import React from 'react';
import {Link} from 'react-router-dom';
import {Pagination, PaginationItem} from 'reactstrap';

class CustomPagination extends React.Component {

  constructor(props) {
    super(props);
    const totalPages = Math.ceil(props.count / props.limit);
    const range = Math.min(totalPages, props.range);
    const center = totalPages > range ? Math.ceil(range / 2) : range;
    const start = (props.page > center ? (props.page >= totalPages - center ? totalPages - range : props.page - center) : 1);
    const end = totalPages > range ? (start + range) : (start + range - 1);
    this.state = {
      range,
      center,
      start,
      end,
      page: props.page,
      query: props.query,
      totalPages
    };
  }

  pageNumbers = () => {
    let pages = [];
    for (let i = this.state.start; i <= this.state.end; i++) {
      const query = new URLSearchParams({...this.state.query, page: i});
      const isActive = i === parseInt(this.state.page);
      pages.push(<PaginationItem key={i} active={isActive}>
        <Link className={"page-link " + (isActive && "text-white")} to={'?' + query.toString()}>{i}</Link>
      </PaginationItem>)
    }
    return pages
  };

  componentDidUpdate = (props) => {
    const totalPages = Math.ceil(props.count / props.limit);
    const range = Math.min(totalPages, props.range);
    const center = totalPages > range ? Math.ceil(range / 2) : range;
    const start = (props.page > center ? (props.page >= totalPages - center ? totalPages - range : props.page - center) : 1);
    const end = totalPages > range ? (start + range) : (start + range - 1);
    this.setState({
      range,
      center,
      start,
      end,
      page: props.page,
      query: props.query,
      totalPages
    });
  };

  render() {
    const className = this.state.status ? this.state.classActive : this.state.classPassive;
    const first = '?' + (new URLSearchParams({...this.state.query, page: 1})).toString();
    const previous = '?' + (new URLSearchParams({...this.state.query, page: parseInt(this.state.page) - 1})).toString();
    const next = '?' + (new URLSearchParams({...this.state.query, page: parseInt(this.state.page) + 1})).toString();
    const last = '?' + (new URLSearchParams({...this.state.query, page: this.state.totalPages})).toString();
    return (
      <Pagination style={{...this.props.style}}
                  ref={this.props.forwardref ? this.props.forwardref : null}
                  className={className + ' ' + this.props.className}>
        <PaginationItem disabled={this.state.page <= this.state.start}>
          <Link className="page-link" to={first}>&laquo;</Link>
        </PaginationItem>
        <PaginationItem disabled={this.state.page <= this.state.start}>
          <Link className="page-link" to={previous}>&lsaquo;</Link>
        </PaginationItem>
        {
          this.pageNumbers()
        }
        <PaginationItem disabled={this.state.page >= this.state.end}>
          <Link className="page-link" to={next}>&rsaquo;</Link>
        </PaginationItem>
        <PaginationItem disabled={this.state.page >= this.state.end}>
          <Link className="page-link" to={last}>&raquo;</Link>
        </PaginationItem>
      </Pagination>
    );
  }
}


export default React.forwardRef((props, ref) =>
  (
    <CustomPagination {...props} forwardref={ref}/>
  )
)

