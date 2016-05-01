(function() {
    'use strict';
    var ko = window.ko;
    var Ya = window.Ya;
    var modelExtend = window.modelExtend;
    var getRootULR = window.getRootULR;

    function QuestionViewModel(props) {
        this.title = null;
        this.answers = [];
        this.correct_answer = null;
        this.selected = ko.observable(-1);

        this.isSelected = ko.pureComputed(function() {
            return this.selected() > -1;
        }, this);

        this.answerIsCorrect = ko.pureComputed(function() {
            var selected = ko.unwrap(this.selected);
            return selected === this.correct_answer;
        }, this);

        this.picture_hide = 'resources/quiz-pictures/' +
            props.picture_name + '-hide.jpg';
        this.picture_result = 'resources/quiz-pictures/' +
            props.picture_name + '.jpg';
        modelExtend(this, props);
    }

    QuestionViewModel.prototype.selectAnswer = function(answerIndex) {
        this.selected(answerIndex);
    };

    //
    //
    function AppViewModel() {
        this.currentPage = ko.observable('main');

        this.currentQuestion = ko.observable(0);
        this.questions = ko.observableArray(window.DATA.map(function(q) {
            return new QuestionViewModel(q);
        }));

        this.correctAnswersCount = ko.observable(0);
        this.result_picture = ko.observable();
        this.result_text = ko.observable();
    }

    AppViewModel.prototype.init = function() {
        this.share = Ya.share2('yandex-share', {
            theme: {
                services: 'vkontakte,facebook,twitter',
                counter: true,
                lang: 'ru'
            }
        });
    };

    AppViewModel.prototype.getPicture = function(correct, questionsCount) {
        if (correct === questionsCount) {
            return 'https://pp.vk.me/c629420/v629420694/4a665/tGwTC5Eom4g.jpg';
        } else if (correct > (questionsCount / 2)) {
            return 'https://pp.vk.me/c629420/v629420694/4a629/S488sz5rX8A.jpg';
        } else {
            return 'https://pp.vk.me/c629420/v629420694/4a620/-zvo5kKiHP4.jpg';
        }
    };

    AppViewModel.prototype.getText = function(correct, questionsCount) {
        if (correct === questionsCount) {
            return 'Вы — превосходный труженник!';
        } else if (correct > (questionsCount / 2)) {
            return 'Вы — ударник социалистического труда!';
        } else {
            return 'Сталина на вас нет!';
        }
    };

    AppViewModel.prototype.getTextForShare = function(correct, questionsCount) {
        if (correct === questionsCount) {
            return 'Я — превосходный труженник!';
        } else if (correct > (questionsCount / 2)) {
            return 'Я — ударник социалистического труда!';
        } else {
            return 'Сталина на меня нет!';
        }
    };

    AppViewModel.prototype.finish = function() {
        var questions = ko.unwrap(this.questions);
        var correctAnswersCount = questions.reduce(function(prev, question) {
            var value = question.answerIsCorrect() ? 1 : 0;
            return prev + value;
        }, 0);
        var resultPicture = this.getPicture(
            correctAnswersCount, questions.length);
        this.result_picture(resultPicture);
        this.result_text(this.getText(
            correctAnswersCount, questions.length));

        var shareText = this.getTextForShare(
            correctAnswersCount, questions.length);

        this.correctAnswersCount(correctAnswersCount);
        this.currentPage('result');
        this.share.updateContent({
            title: shareText + ' ' +
                correctAnswersCount + ' из ' + questions.length,
            description: 'Пройди тест на знание советских плакатов и ты!',
            image: resultPicture
        });
    };

    document.addEventListener('DOMContentLoaded', function() {
        window.m_site = new AppViewModel();
        window.m_site.init();
        ko.applyBindings(window.m_site);
    });
})();
