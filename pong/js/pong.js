'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Vec = function () {
    function Vec() {
        var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        _classCallCheck(this, Vec);

        this.x = x;
        this.y = y;
    }

    _createClass(Vec, [{
        key: 'len',
        get: function get() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        },
        set: function set(value) {
            var f = value / this.len;
            this.x *= f;
            this.y *= f;
        }
    }]);

    return Vec;
}();

var Rect = function () {
    function Rect() {
        var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        _classCallCheck(this, Rect);

        this.pos = new Vec(0, 0);
        this.size = new Vec(x, y);
    }

    _createClass(Rect, [{
        key: 'left',
        get: function get() {
            return this.pos.x - this.size.x / 2;
        }
    }, {
        key: 'right',
        get: function get() {
            return this.pos.x + this.size.x / 2;
        }
    }, {
        key: 'top',
        get: function get() {
            return this.pos.y - this.size.y / 2;
        }
    }, {
        key: 'bottom',
        get: function get() {
            return this.pos.y + this.size.y / 2;
        }
    }]);

    return Rect;
}();

var Ball = function (_Rect) {
    _inherits(Ball, _Rect);

    function Ball() {
        _classCallCheck(this, Ball);

        var _this = _possibleConstructorReturn(this, (Ball.__proto__ || Object.getPrototypeOf(Ball)).call(this, 10, 10));

        _this.vel = new Vec();
        return _this;
    }

    return Ball;
}(Rect);

var Player = function (_Rect2) {
    _inherits(Player, _Rect2);

    function Player() {
        _classCallCheck(this, Player);

        var _this2 = _possibleConstructorReturn(this, (Player.__proto__ || Object.getPrototypeOf(Player)).call(this, 100, 20));

        _this2.vel = new Vec();
        _this2.score = 0;
        _this2.lives = 3;

        _this2._lastPos = new Vec();
        return _this2;
    }

    _createClass(Player, [{
        key: 'update',
        value: function update(dt) {
            this.vel.x = (this.pos.x - this._lastPos.x) / dt;
            this._lastPos.x = this.pos.x;
        }
    }]);

    return Player;
}(Rect);

var Pong = function () {
    function Pong(canvas, scoreDiv, computerScoreDiv) {
        var _this3 = this;

        _classCallCheck(this, Pong);

        this._canvas = canvas;
        this._context = canvas.getContext('2d');
        this._playerScoreDiv = scoreDiv;
        this._computerScoreDiv = computerScoreDiv;

        this.initialSpeed = 300;
        this.lastSpeed;

        this.offset = 0;

        this.ball = new Ball();

        this.players = [new Player(), new Player()];

        this.players[0].pos.y = this._canvas.height - this.players[0].size.y / 2;
        this.players[1].pos.y = this.players[1].size.y / 2;
        this.players.forEach(function (p) {
            return p.pos.x = _this3._canvas.width / 2;
        });
        this.players[0].score = 0;
        this.players[1].score = 0;

        var lastTime = null;
        this._frameCallback = function (millis) {
            if (lastTime !== null) {
                var diff = millis - lastTime;
                _this3.update(diff / 1000);
            }
            lastTime = millis;
            requestAnimationFrame(_this3._frameCallback);
        };

        this.reset();
    }

    _createClass(Pong, [{
        key: 'alertResult',
        value: function alertResult() {
            var playerOne = this.players[0];
            var computer = this.players[1];
            if (playerOne.score === 11 || computer.score === 11) {
                if (playerOne.score === 11) {
                    alert('Player wins ' + playerOne.score + '-' + computer.score);
                } else if (computer.score === 11) {
                    alert('Player loses ' + playerOne.score + '-' + computer.score);
                }
                this.lastSpeed = null;
                playerOne.score = 0;
                computer.score = 0;
            }
        }
    }, {
        key: 'centerPaddle',
        value: function centerPaddle(ball, computer, dt) {
            var computerNewPos = computer._lastPos.x += ball.vel.x * dt;
            if (computerNewPos != ball.pos.x && ball.vel.y) {
                computer.pos.x += ball.vel.x * dt - (computerNewPos - ball.pos.x) * 0.01;
            } else {
                computer.pos.x += ball.vel.x * dt;
            }
        }
    }, {
        key: 'clear',
        value: function clear() {
            this._context.fillStyle = '#000';
            this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
        }
    }, {
        key: 'collide',
        value: function collide(player, ball) {
            if (player.left < ball.right && player.right > ball.left && player.top < ball.bottom && player.bottom > ball.top) {
                this.offset = 0;
                ball.pos.y = ball.vel.y < 0 ? player.bottom + player.size.y / 2 : player.top - player.size.y / 2;
                if (ball.vel.len >= 400 && ball.vel.len < 850) {
                    ball.vel.y = -ball.vel.y * 1.005;
                } else if (ball.vel.len < 400) {
                    ball.vel.y = -ball.vel.y * 1.03;
                } else {
                    ball.vel.y = -ball.vel.y;
                }

                var len = ball.vel.len;
                ball.vel.x += player.vel.x * .2;
                if (Math.abs(ball.vel.x) > 500) {
                    ball.vel.x = Math.floor(ball.vel.x / 13);
                }
                ball.vel.len = len;
                if (ball.vel.y > 0) {
                    this.offset = 0;
                } else if (Math.abs(ball.vel.x) > 135) {
                    this.offset = this.getOffsetCollide();
                }
            }
        }
    }, {
        key: 'draw',
        value: function draw() {
            var _this4 = this;

            this.clear();
            this.drawRect(this.ball);
            this.players.forEach(function (player) {
                return _this4.drawRect(player);
            });
        }
    }, {
        key: 'drawRect',
        value: function drawRect(rect) {
            this._context.fillStyle = '#fff';
            this._context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
        }
    }, {
        key: 'getOffset',
        value: function getOffset() {
            var offset = void 0;
            if (this.ball.vel.len >= 300 && this.ball.vel.len < 400) {
                offset = this.getRandomRange(0.5, 1.1);
                offset *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
            } else if (this.ball.vel.len >= 400 && this.ball.vel.len < 500) {
                offset = this.getRandomRange(0.5, 2.2);
                offset *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
            } else if (this.ball.vel.len >= 500 && this.ball.vel.len < 600) {
                offset = this.getRandomRange(0.5, 3.2);
                offset *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
            } else if (this.ball.vel.len >= 600 && this.ball.vel.len < 700) {
                offset = this.getRandomRange(1.0, 5.0);
                offset *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
            } else if (this.ball.vel.len >= 700 && this.ball.vel.len < 800) {
                offset = this.getRandomRange(1.5, 5.8);
                offset *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
            } else {
                offset = this.getRandomRange(1.5, 8.5);
                offset *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
            }

            return offset;
        }
    }, {
        key: 'getOffsetCollide',
        value: function getOffsetCollide() {
            var offset = void 0;
            if (this.ball.vel.len >= 300 && this.ball.vel.len < 400) {
                offset = this.getRandomRange(0.5, 0.8);
                offset *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
            } else if (this.ball.vel.len >= 400 && this.ball.vel.len < 500) {
                offset = this.getRandomRange(0.5, 2.1);
                offset *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
            } else if (this.ball.vel.len >= 500 && this.ball.vel.len < 600) {
                offset = this.getRandomRange(0.5, 2.6);
                offset *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
            } else if (this.ball.vel.len >= 600 && this.ball.vel.len < 700) {
                offset = this.getRandomRange(0.5, 3.1);
                offset *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
            } else if (this.ball.vel.len >= 700 && this.ball.vel.len < 800) {
                offset = this.getRandomRange(1.0, 3.4);
                offset *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
            } else {
                offset = this.getRandomRange(0.5, 3.6);
                offset *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
            }

            return offset;
        }
    }, {
        key: 'getRandomRange',
        value: function getRandomRange(min, max) {
            return Math.random() * (max - min) + min;
        }
    }, {
        key: 'play',
        value: function play() {
            var b = this.ball;
            var playerOne = this.players[0];
            var computer = this.players[1];
            if (b.vel.x === 0 && b.vel.y === 0) {
                b.vel.x = this.getRandomRange(20, 200);
                b.vel.x *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
                b.vel.y = -this.getRandomRange(150, 600);
                if (playerOne.score === 0 && computer.score === 0) {
                    b.vel.len = this.initialSpeed;
                } else if (!this.lastSpeed) {
                    b.vel.len = this.initialSpeed;
                } else if (this.lastSpeed) {
                    b.vel.len = this.lastSpeed;
                }
            }
        }
    }, {
        key: 'reset',
        value: function reset() {
            var b = this.ball;
            var playerOne = this.players[0];
            var computer = this.players[1];
            this.offset = 0;
            b.vel.x = 0;
            b.vel.y = 0;
            b.pos.x = this._canvas.width / 2;
            b.pos.y = this._canvas.height / 2;
            computer.pos.x = b.pos.x;
            if (playerOne.score === 11 || computer.score === 11) {
                this.alertResult();
            }
            this._playerScoreDiv.innerText = 'Player score: ' + playerOne.score;
            this._computerScoreDiv.innerText = 'Computer score: ' + computer.score;
        }
    }, {
        key: 'start',
        value: function start() {
            requestAnimationFrame(this._frameCallback);
        }
    }, {
        key: 'update',
        value: function update(dt) {
            var _this5 = this;

            var cvs = this._canvas;
            var ball = this.ball;
            var computer = this.players[1];
            var p = this.players[0];
            ball.pos.x += ball.vel.x * dt;
            ball.pos.y += ball.vel.y * dt;

            if (Math.abs(ball.vel.x) > 155 && ball.pos.y - computer.pos.y < 130) {
                computer.pos.x += ball.vel.x * dt + this.offset;
            } else {
                this.centerPaddle(ball, computer, dt);
            }
            if (ball.vel.y < 0 && ball.top < 0 || ball.vel.y > 0 && ball.bottom > cvs.height) {
                ++this.players[ball.vel.y > 0 | 0].score;
                this.lastSpeed = ball.vel.len;
                this.reset();
            }
            if (ball.vel.x < 0 && ball.left < 0) {
                ball.pos.x = 0;
                computer.pos.x = ball.pos.x;
                ball.vel.x = -ball.vel.x;
                this.offset = this.getOffset();
            }
            if (ball.vel.x > 0 && ball.right > cvs.width) {
                ball.pos.x = cvs.width;
                computer.pos.x = ball.pos.x;
                ball.vel.x = -ball.vel.x;
                this.offset = this.getOffset();
            }

            this.players.forEach(function (player, i) {
                player.update(dt);
                _this5.collide(player, ball);
                if (i === 0) {
                    if (player.left < 0) {
                        player.pos.x = player.size.x / 2;
                    }
                    if (player.right > cvs.width) {
                        player.pos.x = cvs.width - player.size.x / 2;
                    }
                }
            });
            this.draw();
        }
    }]);

    return Pong;
}();

var canvas = document.querySelector('#pong');
var playerScoreDiv = document.querySelector('#playerScore');
var computerScoreDiv = document.querySelector('#computerScore');

var pong = new Pong(canvas, playerScoreDiv, computerScoreDiv);

canvas.addEventListener('click', function () {
    if (pong.ball.vel.x == 0 && pong.ball.vel.y == 0) {
        pong.play();
    }
});

canvas.addEventListener('mousemove', function (event) {
    var scale = event.offsetX / event.target.getBoundingClientRect().width;
    pong.players[0].pos.x = canvas.width * scale;
});

pong.start();
