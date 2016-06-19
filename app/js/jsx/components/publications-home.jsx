import React from 'react';
import ReactDOM from 'react-dom';
import ReactPaginate from 'react-paginate';
import $ from 'jquery';

window.React = React;

class CommentList extends React.Component {

    constructor(){
        super()
    }

    _sortByCell (){
        ReactDOM.render(
            <App url={location.href + '/mocs/publications-home.json'}
                 perPage={6} colClass={'item col-6'}/>,
            document.getElementById('explore')
        )
    }

    _sortByCol (){
        ReactDOM.render(
            <App url={location.href + '/mocs/publications-home.json'}
                 perPage={6} colClass={'item col-12'}/>,
            document.getElementById('explore')
        )
    }

    render() {
        let self = this;
        let commentNodes = this.props.data.map(function (comment, index) {
            return (
                <div key={index} className={self.props.colClass || 'item col-6'}>
                    <div className="item-border">
                        <h2 className="item-title">{comment.username}</h2>
                        <p className="item-autor">
                            <i className="icon icon-user"/>
                            {comment.comment}
                        </p>
                        <p className="item-section">
                            <i className="icon icon-books"/>
                            {comment.comment}
                        </p>
                    </div>
                </div>
            );
        });

        return (
            <div className="col-12 grid-center">
                <div className="col-10 grid-spaceAround">
                    <div className="col-6">
                        <h1 className="title">Explorar publicaciones</h1></div>
                    <div className="col-6">
                        <ul className="sort">
                            <li>Según:</li>
                            <li>
                                <button className="btn">Materias</button>
                            </li>
                            <li>
                                <button className="btn active">Licencias</button>
                            </li>
                            <li>
                                <button className="btn">Certificaciones</button>
                            </li>
                            <li>
                                <ul className="sort-style">
                                    <li>
                                        <button className="btn-img" onClick={this._sortByCell}>
                                            <img src="images/sort-icon-grid.png"/></button>
                                    </li>
                                    <li>
                                        <button className="btn-img" onClick={this._sortByCol}>
                                            <img src="images/sort-icon-column.png"/></button>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="col-10 explore-grid grid-spaceBetween">
                    {commentNodes}
                </div>
            </div>
        )
    }
}

export class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            offset: 0
        }
    }

    loadCommentsFromServer() {
        $.ajax({
            url      : this.props.url,
            data     : {limit: this.props.perPage, offset: this.state.offset},
            dataType : 'json',
            type     : 'GET',

            success: data => {
                this.setState({data: data.comments, pageNum: Math.ceil(data.meta.total_count / data.meta.limit)});
            },

            error: (xhr, status, err) => {
                console.error(this.props.url, status, err.toString());
            }
        });
    }

    componentDidMount() {
        this.loadCommentsFromServer();
    }

    handlePageClick = (data) => {
        let selected = data.selected;
        let offset = Math.ceil(selected * this.props.perPage);

        this.setState({offset: offset}, () => {
            this.loadCommentsFromServer();
        });
    };

    render() {
        return (
            <div>
                <CommentList data={this.state.data} colClass={this.props.colClass}/>
                <ReactPaginate previousLabel={"previous"}
                               nextLabel={"next"}
                               breakLabel={<a href="">...</a>}
                               pageNum={this.state.pageNum}
                               marginPagesDisplayed={2}
                               pageRangeDisplayed={5}
                               clickCallback={this.handlePageClick}
                               containerClassName={"pagination"}
                               subContainerClassName={"pages pagination"}
                               activeClassName={"active"}/>
            </div>
        );
    }
}

ReactDOM.render(
    <App url={location.href + '/mocs/publications-home.json'}
         perPage={6}/>,
    document.getElementById('explore')
);
