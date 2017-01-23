'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _constants = require('./constants');

var consts = _interopRequireWildcard(_constants);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Server = function () {
  function Server(opts) {
    var _this = this;

    _classCallCheck(this, Server);

    this.handleDisconnect = function () {
      console.log("disconnect");
    };

    this.sendServerHello = function () {
      //## Sending Server Hello...
      var payload = Buffer.alloc(128);
      var pos = 4;
      pos = payload.writeUInt8(10, pos); // Protocol version

      pos += payload.write(_this.banner || "MyServer/1.0", pos);
      pos = payload.writeUInt8(0, pos);

      pos = payload.writeUInt32LE(process.pid, pos);

      pos += _this.salt.copy(payload, pos, 0, 8);
      pos = payload.writeUInt8(0, pos);

      pos = payload.writeUInt16LE(consts.CLIENT_LONG_PASSWORD | consts.CLIENT_CONNECT_WITH_DB | consts.CLIENT_PROTOCOL_41 | consts.CLIENT_SECURE_CONNECTION, pos);

      if (_this.serverCharset) {
        pos = payload.writeUInt8(_this.serverCharset, pos);
      } else {
        pos = payload.writeUInt8(0x21, pos); // latin1
      }
      pos = payload.writeUInt16LE(consts.SERVER_STATUS_AUTOCOMMIT, pos);
      payload.fill(0, pos, pos + 13);
      pos += 13;

      pos += _this.salt.copy(payload, pos, 8);
      pos = payload.writeUInt8(0, pos);
      _this.writeHeader(payload, pos);

      return _this.sendPacket(payload.slice(0, pos));
    };

    this.handleData = function (data) {
      if (data && data.length > 0) {
        _this.incoming.push(data);
      }
      _this.gatherIncoming();
      if (data == null) {
        console.log("Connection closed");
        _this.socket.destroy();
      }
    };

    this.helloPacketHandler = function (packet) {
      //## Reading Client Hello...

      // http://dev.mysql.com/doc/internals/en/the-packet-header.html

      if (packet.length == 0) return _this.sendError({ message: "Zero length hello packet" });

      var ptr = 0;

      var clientFlags = packet.slice(ptr, ptr + 4);
      ptr += 4;

      var maxPacketSize = packet.slice(ptr, ptr + 4);
      ptr += 4;

      _this.clientCharset = packet.readUInt8(ptr);
      ptr++;

      var filler1 = packet.slice(ptr, ptr + 23);
      ptr += 23;

      var usernameEnd = packet.indexOf(0, ptr);
      var username = packet.toString('ascii', ptr, usernameEnd);
      ptr = usernameEnd + 1;

      var scrambleBuff = void 0;

      var scrambleLength = packet.readUInt8(ptr);
      ptr++;

      if (scrambleLength > 0) {
        _this.scramble = packet.slice(ptr, ptr + scrambleLength);
        ptr += scrambleLength;
      }

      var database = void 0;

      var databaseEnd = packet.indexOf(0, ptr);
      if (databaseEnd >= 0) {
        database = data.toString('ascii', ptr, databaseEnd);
      }
      _this.onPacket = null;

      return Promise.resolve(_this.onAuthorize({ clientFlags: clientFlags, maxPacketSize: maxPacketSize, username: username, database: database })).then(function (authorized) {
        if (!authorized) throw "Not Authorized";

        _this.onPacket = _this.normalPacketHandler;
        _this.gatherIncoming();
        _this.sendOK({ message: "OK" });
      }).catch(function (err) {
        console.log(err);
        _this.sendError({ message: "Authorization Failure" });
        _this.socket.destroy();
      });
    };

    Object.assign(this, opts);

    if (!this.banner) this.banner = "MyServer/1.0";
    if (!this.salt) this.salt = _crypto2.default.randomBytes(20);
    this.sequence = 0;
    this.onPacket = this.helloPacketHandler;
    this.incoming = [];

    this.socket.on('data', this.handleData);
    this.socket.on('end', this.handleDisconnect);

    this.sendServerHello();
  }

  _createClass(Server, [{
    key: 'writeHeader',
    value: function writeHeader(data, len) {
      data.writeUIntLE(len - 4, 0, 3);
      data.writeUInt8(this.sequence++ % 256, 3);
    }
  }, {
    key: 'sendPacket',
    value: function sendPacket(payload) {
      return this.socket.write(payload);
    }
  }, {
    key: 'newDefinition',
    value: function newDefinition(params) {
      return {
        catalog: params.catalog ? params.catalog : 'def',
        schema: params.db,
        table: params.table,
        orgTable: params.orgTable,
        name: params.name,
        orgName: params.orgName,
        length: params.length ? params.length : 0,
        type: params.type ? params.type : consts.MYSQL_TYPE_STRING,
        flags: params.flags ? params.flags : 0,
        decimals: params.decimals,
        'default': params['default']
      };
    }
  }, {
    key: 'sendDefinitions',
    value: function sendDefinitions(definitions) {
      // Write Definition Header
      var payload = Buffer.alloc(1024);
      var len = 4;
      len = writeLengthCodedBinary(payload, len, definitions.length);
      this.writeHeader(payload, len);
      this.sendPacket(payload.slice(0, len));

      // Write each definition
      len = 4;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = definitions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var definition = _step.value;
          var _arr = ['catalog', 'schema', 'table', 'orgTable', 'name', 'orgName'];

          for (var _i = 0; _i < _arr.length; _i++) {
            var field = _arr[_i];
            var val = definition[field] || "";
            len = writeLengthCodedString(payload, len, val);
          }
          len = payload.writeUInt8(0x0C, len);
          len = payload.writeUInt16LE(11, len); // ASCII
          len = payload.writeUInt32LE(definition.columnLength, len);
          len = payload.writeUInt8(definition.columnType, len);
          len = payload.writeUInt16LE(definition.flags ? definition.flags : 0, len);
          len = payload.writeUInt8(definition.decimals ? definition.decimals : 0, len);
          len = payload.writeUInt16LE(0, len); // \0\0 FILLER
          len = writeLengthCodedString(payload, len, definition['default']);
          this.writeHeader(payload, len);
          this.sendPacket(payload.slice(0, len));
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      this.sendEOF();
    }
  }, {
    key: 'sendRow',
    value: function sendRow(row) {
      var payload = Buffer.alloc(1024);
      var len = 4;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = row[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var cell = _step2.value;

          if (cell == null) {
            len = payload.writeUInt8(0xFB, len);
          } else {
            len = writeLengthCodedString(payload, len, cell);
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      this.writeHeader(payload, len);
      this.sendPacket(payload.slice(0, len));
    }
  }, {
    key: 'sendRows',
    value: function sendRows() {
      var rows = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = rows[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var row = _step3.value;

          this.sendRow(row);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      this.sendEOF();
    }
  }, {
    key: 'sendEOF',
    value: function sendEOF() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref$warningCount = _ref.warningCount,
          warningCount = _ref$warningCount === undefined ? 0 : _ref$warningCount,
          _ref$serverStatus = _ref.serverStatus,
          serverStatus = _ref$serverStatus === undefined ? consts.SERVER_STATUS_AUTOCOMMIT : _ref$serverStatus;

      // Write EOF
      var payload = Buffer.alloc(16);
      var len = 4;
      len = payload.writeUInt8(0xFE, len);
      len = payload.writeUInt16LE(warningCount, len);
      len = payload.writeUInt16LE(serverStatus, len);
      this.writeHeader(payload, len);
      this.sendPacket(payload.slice(0, len));
    }
  }, {
    key: 'gatherIncoming',
    value: function gatherIncoming() {
      var incoming = void 0;
      if (this.incoming.length > 0) {
        var len = 0;
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = this.incoming[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var buf = _step4.value;

            len += buf.length;
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
              _iterator4.return();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }

        incoming = Buffer.alloc(len);
        len = 0;
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = this.incoming[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var _buf = _step5.value;

            len += _buf.copy(incoming, len);
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5.return) {
              _iterator5.return();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }
      } else {
        incoming = this.incoming[0];
      }
      var remaining = this.readPackets(incoming);
      this.incoming = [Buffer.from(remaining)];
    }
  }, {
    key: 'readPackets',
    value: function readPackets(buf) {
      var offset = 0;
      while (true) {
        var _data = buf.slice(offset);
        if (_data.length < 4) return _data;

        var packetLength = _data.readUIntLE(0, 3);
        if (_data.length < packetLength + 4) return _data;

        this.sequence = _data.readUIntLE(3) + 1;
        offset += packetLength + 4;
        var packet = _data.slice(4, packetLength + 4);

        this.onPacket(packet);
        this.packetCount++;
      }
    }
  }, {
    key: 'normalPacketHandler',
    value: function normalPacketHandler(packet) {
      if (packet == null) throw "Empty packet";
      return this.onCommand({
        command: packet.readUInt8(0),
        extra: packet.length > 1 ? packet.slice(1) : null
      });
    }
  }, {
    key: 'sendOK',
    value: function sendOK(_ref2) {
      var message = _ref2.message,
          _ref2$affectedRows = _ref2.affectedRows,
          affectedRows = _ref2$affectedRows === undefined ? 0 : _ref2$affectedRows,
          insertId = _ref2.insertId,
          _ref2$warningCount = _ref2.warningCount,
          warningCount = _ref2$warningCount === undefined ? 0 : _ref2$warningCount;

      var data = Buffer.alloc(message.length + 64);
      var len = 4;
      len = data.writeUInt8(0, len);
      len = writeLengthCodedBinary(data, len, affectedRows);
      len = writeLengthCodedBinary(data, len, insertId);
      len = data.writeUInt16LE(consts.SERVER_STATUS_AUTOCOMMIT, len);
      len = data.writeUInt16LE(warningCount, len);
      len = writeLengthCodedString(data, len, message);

      this.writeHeader(data, len);
      this.sendPacket(data.slice(0, len));
    }
  }, {
    key: 'sendError',
    value: function sendError(_ref3) {
      var _ref3$message = _ref3.message,
          message = _ref3$message === undefined ? 'Unknown MySQL error' : _ref3$message,
          _ref3$errno = _ref3.errno,
          errno = _ref3$errno === undefined ? 2000 : _ref3$errno,
          _ref3$sqlState = _ref3.sqlState,
          sqlState = _ref3$sqlState === undefined ? "HY000" : _ref3$sqlState;

      //## Sending Error ...
      console.log(message);
      var data = Buffer.alloc(message.length + 64);
      var len = 4;
      len = data.writeUInt8(0xFF, len);
      len = data.writeUInt16LE(errno, len);
      len += data.write("#", len);
      len += data.write(sqlState, len, 5);
      len += data.write(message, len);
      len = data.writeUInt8(0, len);

      this.writeHeader(data, len);
      this.sendPacket(data.slice(0, len));
    }
  }]);

  return Server;
}();

exports.default = Server;

function writeLengthCodedString(buf, pos, str) {
  if (str == null) return buf.writeUInt8(0, pos);
  if (typeof str !== 'string') {
    //Mangle it
    str = str.toString();
  }
  buf.writeUInt8(253, pos);
  buf.writeUIntLE(str.length, pos + 1, 3);
  buf.write(str, pos + 4);
  return pos + str.length + 4;
}

function writeLengthCodedBinary(buf, pos, number) {
  if (number == null) {
    return buf.writeUInt8(251, pos);
  } else if (number < 251) {
    return buf.writeUInt8(number, pos);
  } else if (number < 0x10000) {
    buf.writeUInt8(252, pos);
    buf.writeUInt16LE(number, pos + 1);
    return pos + 3;
  } else if (number < 0x1000000) {
    buf.writeUInt8(253, pos);
    buf.writeUIntLE(number, pos + 1, 3);
    return pos + 4;
  } else {
    buf.writeUInt8(254, pos);
    buf.writeUIntLE(number, pos + 1, 8);
    return pos + 9;
  }
}