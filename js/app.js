var my_news = [
    {
        author: 'First one',
        text: "Some day"
    },
    {
        author: "Second one",
        text: "second day"
    },
    {
        author: "third one",
        text: "third day"
    }
];

var News = React.createClass({
  render: function() {
      var data = this.props.data;
      var newsTemplate = data.map(function(item, index){
        return(
            <div key = {index}>
                <p className = "news__author"> {item.author}: </p>
                <p className = "news__text"> {item.text}: </p>
            </div>
        )
      });
      


    return (
      <div className="news">
        {newsTemplate}
      </div>
    );
  }
});


var App = React.createClass ({
    render: function(){
        return(
            <div className ="app">
           component for showing news

           <News data ={my_news} /> {/*commments*/}
           </div>
        );
    }
});

ReactDOM.render(
   <App/>,
    document.getElementById('root')
);