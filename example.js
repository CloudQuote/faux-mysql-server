import net from 'net';
import FMS, {consts} from './src/index.js';

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

