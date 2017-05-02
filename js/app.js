var my_news = [
    {
        author: 'Саша Печкин',
        text: 'В четчерг, четвертого числа...',
        bigText: 'в четыре с четвертью часа четыре чёрненьких чумазеньких чертёнка чертили чёрными' +
                ' чернилами чертёж.'
    }, {
        author: 'Просто Вася',
        text: 'Считаю, что $ должен стоить 35 рублей!',
        bigText: 'А евро 42!'
    }, {
        author: 'Гость',
        text: 'Бесплатно. Скачать. Лучший сайт - http://localhost:3000',
        bigText: 'На самом деле платно, просто нужно прочитать очень длинное лицензионное соглашен' +
                'ие'
    }
];

window.ee = new EventEmitter();

var Article = React.createClass({
    propTypes: {
        data: React
            .PropTypes
            .shape({author: React.PropTypes.string.isRequired, text: React.PropTypes.string.isRequired})
    },
    getInitialState: function () {
        return {visible: false, rating: 0};
    },

    readMoreCLick: function (e) {
        e.preventDefault();
        this.setState({
            visible: true,
            rating: 1
        }, function () {
            console.log('state was changed');
        });
    },

    render: function () {

        var author = this.props.data.author,
            text = this.props.data.text,
            bigText = this.props.data.bigText;
        var visible = this.state.visible;

        return (
            <div className='article'>
                <p className='news__author'>{author}:</p>
                <p className='news__text'>{text}</p>
                {/* для ссылки readmore: не показывай ссылку, если visible === true */}
                <a
                    onClick={this.readMoreCLick}
                    href="#"
                    className={'news__readmore ' + (visible
                    ? 'none'
                    : '')}>Подробнее</a>

                {/* для большо текста: не показывай текст, если visible === false */}
                <p
                    className={'news__big-text ' + (visible
                    ? ''
                    : 'none')}>{bigText}</p>

                <strong
                    className={visible
                    ? ''
                    : 'none'}>
                    test state
                </strong>
            </div>
        )
    }

});

var News = React.createClass({
    propTypes: {
        data: React.PropTypes.array.isRequired
    },
    getInitialState: function () {
        return {counter: 0}
    },

    render: function () {
        var data = this.props.data;

        var newsTemplate

        if (data.length > 0) {

            newsTemplate = data.map(function (item, index) {
                return (
                    <div key={index}>
                        <Article data={item}/>
                    </div>
                )
            });

        } else {
            newsTemplate = "no news were found";
        }
        return (
            <div className="news">
                {newsTemplate}
                <strong
                    className={(data.length > 0
                    ? ''
                    : 'none')}>
                    total news number: {data.length}</strong>
            </div>
        );

    }
});

var Add = React.createClass({
    componentDidMount: function () {
        ReactDOM
            .findDOMNode(this.refs.author)
            .focus();
    },
    getInitialState: function () {
        return {agreeNotChecked: true, authorIsEmpty: true, textIsEmpty: true}
    },
    componentWillReceiveProps: function (nextProps) {
        this.setState({
            likesIncreasing: nextProps.likeCount > this.props.likeCount
        });
    },
    onFieldChange: function (fieldName, e) {
        var next = {};
        if (e.target.value.trim().length > 0) {
            next[fieldName] = false;
            this.setState(next);
        } else {
            next[fieldName] = true;
            this.setState(next);
        }
    },
    onBtnClickHandler: function (e) {
        e.preventDefault();

        var textEl = ReactDOM.findDOMNode(this.refs.text);

        var author = ReactDOM
            .findDOMNode(this.refs.author)
            .value;
        var text = ReactDOM
            .findDOMNode(this.refs.text)
            .value;
        var item = [
            {
                author: author,
                text: text,
                bigText: '...'
            }
        ];

        window
            .ee
            .emit('News.add', item);

        textEl.value = '';
        this.setState({textIsEmpty: true});
    },
    onCheckRuleClick: function (e) {
        // ReactDOM     .findDOMNode(this.refs.alert_button)     .disabled =
        // !e.target.checked;
        this.setState({
            agreeNotChecked: !this.state.agreeNotChecked
        }); //устанавливаем значение в state
    },
    render: function () {
        var agreeNotChecked = this.state.agreeNotChecked,
            authorIsEmpty = this.state.authorIsEmpty,
            textIsEmpty = this.state.textIsEmpty;

        console.log('agreeNotChecked: ' + agreeNotChecked);
        console.log('authorIsEmpty: ' + authorIsEmpty);
        console.log('textIsEmpty: ' + textIsEmpty);
        return (
            <form className='add cf'>
                <input
                    type='text'
                    className='add__author'
                    defaultValue=''
                    placeholder='Ваше имя'
                    onChange={this
                    .onFieldChange
                    .bind(this, 'authorIsEmpty')}
                    ref='author'/>
                <textarea
                    className='add__text'
                    defaultValue=''
                    placeholder='Текст новости'
                    onChange={this
                    .onFieldChange
                    .bind(this, 'textIsEmpty')}
                    ref='text'></textarea>
                <label className='add__checkrule'>
                    <input
                        type='checkbox'
                        defaultChecked={false}
                        ref='checkrule'
                        onChange={this.onCheckRuleClick}/>Я согласен с правилами
                </label>
                <button
                    className='add__btn'
                    onClick={this.onBtnClickHandler}
                    ref='alert_button'
                    disabled={agreeNotChecked || authorIsEmpty || textIsEmpty}>
                    Добавить новость
                </button>
            </form>
        )
    }
});

var App = React.createClass({
    getInitialState: function () {
        return {news: my_news}
    },
    componentDidMount: function () {
        /* Слушай событие "Создана новость"
      если событие произошло, обнови this.state.news
    */
        var self = this;
        window
            .ee
            .addListener('News.add', function (item) {
                var nextNews = item.concat(self.state.news);
                self.setState({news: nextNews});
            });
    },
    componentWillUnmount: function () {
        /* Больше не слушай событие "Создана новость" */
        window
            .ee
            .removeListener('News.add');
    },
    render: function () {
        console.log('render');
        return (
            <div className="app">
                <h3>news</h3>
                <Add/>
                <News data ={this.state.news}/> {/*commments*/}
            </div>
        );
    }
});

ReactDOM.render(
    <App/>, document.getElementById('root'));