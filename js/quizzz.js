class QuizzzPage extends React.Component {
    constructor() {
        super();
        this.state = {
            name: 'FrontMen',
            username: '',
            showQuizzz: false
        };
        //this.handleClick = this.handleClick.bind(this);
    }
    handleStart = (evt) => {
        this.setState({ showQuizzz: true });
    };
    handleNameChange = (evt) => {
        this.setState({ name: evt.target.value });
        this.setState({ username: evt.target.value });

    }
    render() {
        return (
            <div>
                <h1>Hey, {this.state.name}!</h1>
                <p>Are you up for a quizzz</p>

                <div>Please tell me your name</div>
                <div className={this.state.showQuizzz ? 'hidden' : ''}>
                    <input type="text"
                        placeholder="Your name please"
                        value={this.state.username}
                        onChange={this.handleNameChange}
                    />
                    <button disabled={!this.state.username} onClick={this.handleStart}>Login</button>
                </div>
                {this.state.showQuizzz ? <Quizzz userstate={this.state.username} /> : null}
            </div>
        );
    }
};

class Quizzz extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isToggleOn: true,
            question: this.emptyQuestion(),
            userstate: {
                name: null,
                score: 0
            }
        };
        this.useDummy = true;
        this.dummyq = { "response_code": 0, "results": [{ "category": "Sports", "type": "multiple", "difficulty": "medium", "question": "A stimpmeter measures the speed of a ball over what surface?", "correct_answer": "Golf Putting Green", "incorrect_answers": [" Football Pitch", "Cricket Outfield", "Pinball Table"] }] };
        this.questions = [];


        // This binding is necessary to make `this` work in the callback
        this.handleClick = this.handleClick.bind(this);


    };

    //{"response_code":0,"results":[{"category":"Sports","type":"multiple","difficulty":"medium","question":"A stimpmeter measures the speed of a ball over what surface?","correct_answer":"Golf Putting Green","incorrect_answers":[" Football Pitch","Cricket Outfield","Pinball Table"]}]}

    emptyQuestion() {
        return {
            answers: [],
            question: '',
        };
    };
    componentDidMount() {
        this.getQuestion();
    };

    uniqueQuestion(obj) {
        if (!this.questions.some(e => e.question === obj.question)) {
            this.questions.push(obj);
            return true;
        }
        else { return false; }
    };
    addQuestion(q) {
        console.log(q);

        q.answers = [];
        q.answers.push(...q.incorrect_answers);
        q.answers.splice(Math.random() * 3, 0, q.correct_answer);

        console.log(q);
        this.setState({
            isLoaded: true,
            question: q
        });

    };
    getQuestion(param) {
        console.log('getting question: ' + param);

        fetch('https://opentdb.com/api.php?amount=1')
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result.results[0]);

                    if (uniqueQuestion(result.results[0])) {

                        const newQuestion = result.results[0];

                        addQuestion(newQuestion);
                    }
                    else {
                        getQuestion('retry');
                    }
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    console.log('errorororororrororor');
                    if (this.useDummy) {

                        this.addQuestion(this.dummyq.results[0]);

                    }
                    else {
                        this.setState({
                            isLoaded: true,
                            error
                        });
                    }

                }
            )

    };
    handleClick(item, e) {
        const correct = validateItem(item);
        const updateUserstate = this.state.userstate;
        updateUserstate.score += correct ? 1 : 0;

        this.setState(state => ({
            userstate: updateUserstate
        }));
    
        // get the next question
        this.getQuestion(this.questions.length);
    }

render() {
    const q = this.state.question;
    const u = this.state.userstate;
    return (
        <div className="answer-box">
            <div>Score:{u.score}</div>
            <div>Lets go {u.username}! Question {this.questions.length}:</div>
            <div className="row">
                {q.answers.map(item => (

                    <div className="col-6" key={item.toString()}>
                        <button className="answer-button" onClick={(e) => this.handleClick(item, e)}>{item}<button>
</div>

                            ))}

                </div>

                    </div>
                );
                }
            }
            
ReactDOM.render(<QuizzzPage />,document.getElementById('root'));
