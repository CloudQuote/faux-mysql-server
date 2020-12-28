# faux-mysql-server
A library which implements the MySQL server protocol, giving you the ability to create MySQL-like services

## Synopsis

This is a server-side implementation of the MySQL network protocol

## Description

This module emulates the server side of the MySQL protocol. This allows you to run your own faux-MySQL servers which can accept commands and queries and reply accordingly.

## Example

See example.js for an example server which repeats the commands back to you that you send

```javascript
import net from 'net';
import FMS from 'faux-mysql';
import * as consts from 'faux-mysql/constants';

net.createServer((so) => {
 let server = new FMS({
  socket: so,
  banner: "Fake Mysql/1.0",
  onAuthorize: handleAuthorize,
  onCommand: handleCommand
 });
}).listen(3306);

console.log("Started server on port 3306");

function handleAuthorize(param) {
 console.log("Auth Info:");
 console.log(param);
 // Yup you are authorized
 return true;
}

function handleCommand({command, extra}) {
 // command is a numeric ID, extra is a Buffer
 switch (command) {
  case consts.COM_QUERY:
   handleQuery.call(this, extra.toString());
   break;
  case consts.COM_PING:
   this.sendOK({message: "OK"});
   break;
  case null:
  case undefined:
  case consts.COM_QUIT:
   console.log("Disconnecting");
   this.end();
   break;
  default:
   console.log("Unknown Command: " + command);
   this.sendError({ message: "Unknown Command"});
   break;
 }
}

function handleQuery(query) {
 // Take the query, print it out
 console.log("Got Query: " + query);
 
 // Then send it back to the user in table format
 this.sendDefinitions([this.newDefinition({ name: 'TheCommandYouSent'})]);
 this.sendRows([
  [query]
 ]);
}
```

## Where it came from

This module was written by Mark Dierolf <mdierolf@cloudquote.net>, as a port of the GPL'd DBIx::MyServer perl module to NodeJS

The original [DBIx::MyServer](https://metacpan.org/pod/DBIx::MyServer) module was written by Philip Stoev <philip@stoev.org>

## License

GPL
