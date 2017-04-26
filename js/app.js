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

var Article = React.createClass({
    propTypes: {
        data: React
            .PropTypes
            .shape({author: React.PropTypes.string.isRequired, text: React.PropTypes.string.isRequired})
    },
    getInitialState: function () {
        return {
             visible: false,
             rating: 0};
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
       var  visible = this.state.visible;

        return (
            <div className='article'>
                <p className='news__author'>{author}:</p>
                <p className='news__text'>{text}</p>
                {/* для ссылки readmore: не показывай ссылку, если visible === true */}
                <a  onClick={this.readMoreCLick}
                    href="#"
                    className={'news__readmore ' + (visible ? 'none' : '')}>Подробнее</a>

                {/* для большо текста: не показывай текст, если visible === false */}
                <p
                    className={'news__big-text ' + (visible  ? '' : 'none')}>{bigText}</p>

                    <strong className={visible  ? '' : 'none'}> test state </strong>
            </div>
        )
    }

});

var News = React.createClass({
    propTypes: {
        data: React.PropTypes.array.isRequired
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

var App = React.createClass({
    render: function () {
        return (
            <div className="app">
                <h3>news</h3>
                <News data ={my_news}/> {/*commments*/}
            </div>
        );
    }
});

ReactDOM.render(
    <App/>, document.getElementById('root'));