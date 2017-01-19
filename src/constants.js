export const MYSERVER_PACKET_COUNT = 0;
export const MYSERVER_SOCKET= 1;
export const MYSERVER_DATABASE= 4;
export const MYSERVER_THREAD_ID= 5;
export const MYSERVER_SCRAMBLE= 6;
export const MYSERVER_DBH= 7;
export const MYSERVER_PARSER= 8;
export const MYSERVER_BANNER= 9;
export const MYSERVER_SERVER_CHARSET = 10;
export const MYSERVER_CLIENT_CHARSET = 11;
export const MYSERVER_SALT= 12;

export const FIELD_CATALOG= 0;
export const FIELD_DB = 1;
export const FIELD_TABLE= 2;
export const FIELD_ORG_TABLE= 3;
export const FIELD_NAME = 4;
export const FIELD_ORG_NAME= 5;
export const FIELD_LENGTH= 6;
export const FIELD_TYPE = 7;
export const FIELD_FLAGS= 8;
export const FIELD_DECIMALS= 9;
export const FIELD_DEFAULT= 10;


//
// This comes from include/mysql_com.h of the MySQL source
//

export const CLIENT_LONG_PASSWORD = 1;
export const CLIENT_FOUND_ROWS= 2;
export const CLIENT_LONG_FLAG= 4;
export const CLIENT_CONNECT_WITH_DB = 8;
export const CLIENT_NO_SCHEMA= 16;
export const CLIENT_COMPRESS= 32;// Must implement that one
export const CLIENT_ODBC= 64;
export const CLIENT_LOCAL_FILES= 128;
export const CLIENT_IGNORE_SPACE = 256;
export const CLIENT_PROTOCOL_41= 512;
export const CLIENT_INTERACTIVE= 1024;
export const CLIENT_SSL = 2048; // Must implement that one
export const CLIENT_IGNORE_SIGPIPE = 4096;
export const CLIENT_TRANSACTIONS = 8192;
export const CLIENT_RESERVED = 16384;
export const CLIENT_SECURE_CONNECTION = 32768;
export const CLIENT_MULTI_STATEMENTS = 1 << 16;
export const CLIENT_MULTI_RESULTS = 1 << 17;
export const CLIENT_SSL_VERIFY_SERVER_CERT = 1 << 30;
export const CLIENT_REMEMBER_OPTIONS= 1 << 31;

export const SERVER_STATUS_IN_TRANS= 1;
export const SERVER_STATUS_AUTOCOMMIT= 2;
export const SERVER_MORE_RESULTS_EXISTS= 8;
export const SERVER_QUERY_NO_GOOD_INDEX_USED = 16;
export const SERVER_QUERY_NO_INDEX_USED= 32;
export const SERVER_STATUS_CURSOR_EXISTS = 64;
export const SERVER_STATUS_LAST_ROW_SENT = 128;
export const SERVER_STATUS_DB_DROPPED= 256;
export const SERVER_STATUS_NO_BACKSLASH_ESCAPES = 512;

export const COM_SLEEP = 0;
export const COM_QUIT = 1;
export const COM_INIT_DB= 2;
export const COM_QUERY = 3;
export const COM_FIELD_LIST= 4;
export const COM_CREATE_DB= 5;
export const COM_DROP_DB= 6;
export const COM_REFRESH= 7;
export const COM_SHUTDOWN= 8;
export const COM_STATISTICS= 9;
export const COM_PROCESS_INFO= 10;
export const COM_CONNECT= 11;
export const COM_PROCESS_KILL= 12;
export const COM_DEBUG = 13;
export const COM_PING = 14;
export const COM_TIME = 15;
export const COM_DELAYED_INSERT= 16;
export const COM_CHANGE_USER= 17;
export const COM_BINLOG_DUMP= 18;
export const COM_TABLE_DUMP= 19;
export const COM_CONNECT_OUT= 20;
export const COM_REGISTER_SLAVE= 21;
export const COM_STMT_PREPARE= 22;
export const COM_STMT_EXECUTE= 23;
export const COM_STMT_SEND_LONG_DATA = 24;
export const COM_STMT_CLOSE= 25;
export const COM_STMT_RESET= 26;
export const COM_SET_OPTION= 27;
export const COM_STMT_FETCH= 28;
export const COM_END = 29;

// This is taken from include/mysql_com.h

export const MYSQL_TYPE_DECIMAL= 0;
export const MYSQL_TYPE_TINY= 1;
export const MYSQL_TYPE_SHORT= 2;
export const MYSQL_TYPE_LONG= 3;
export const MYSQL_TYPE_FLOAT= 4;
export const MYSQL_TYPE_DOUBLE= 5;
export const MYSQL_TYPE_NULL= 6;
export const MYSQL_TYPE_TIMESTAMP = 7;
export const MYSQL_TYPE_LONGLONG = 8;
export const MYSQL_TYPE_INT24= 9;
export const MYSQL_TYPE_DATE= 10;
export const MYSQL_TYPE_TIME= 11;
export const MYSQL_TYPE_DATETIME = 12;
export const MYSQL_TYPE_YEAR= 13;
export const MYSQL_TYPE_NEWDATE= 14;
export const MYSQL_TYPE_VARCHAR= 15;
export const MYSQL_TYPE_BIT= 16;
export const MYSQL_TYPE_NEWDECIMAL = 246;
export const MYSQL_TYPE_ENUM= 247;
export const MYSQL_TYPE_SET= 248;
export const MYSQL_TYPE_TINY_BLOB = 249;
export const MYSQL_TYPE_MEDIUM_BLOB = 250;
export const MYSQL_TYPE_LONG_BLOB = 251;
export const MYSQL_TYPE_BLOB= 252;
export const MYSQL_TYPE_VAR_STRING = 253;
export const MYSQL_TYPE_STRING= 254;
export const MYSQL_TYPE_GEOMETRY = 255;

export const NOT_NULL_FLAG= 1;
export const PRI_KEY_FLAG= 2;
export const UNIQUE_KEY_FLAG= 4;
export const MULTIPLE_KEY_FLAG= 8;
export const BLOB_FLAG = 16;
export const UNSIGNED_FLAG= 32;
export const ZEROFILL_FLAG= 64;
export const BINARY_FLAG= 128;
export const ENUM_FLAG = 256;
export const AUTO_INCREMENT_FLAG = 512;
export const TIMESTAMP_FLAG= 1024;
export const SET_FLAG = 2048;
export const NO_DEFAULT_VALUE_FLAG = 4096;
export const NUM_FLAG = 32768;
