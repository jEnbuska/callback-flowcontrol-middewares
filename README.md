Middleware function for controlling flow of callback functions 

implemented with typescript


#### Development
first: ```npm install```

dev: ```npm start```

test: ```npm run test```

use playground: 
```
npm run build-watch
--< open new terminal tab >--
cd playground
npm install && npm start
('npm start' might require SUDO, because creates link to parent project)
```

#### Examples
#### debounce
```
const later = debounce(function(){
   return Date.now();
}, 100)

const now = Date.now();
const after = later();
assert(now <= after - 100);
```

#### latest
```
const fetchUsers = latest(async function * (cb){
   const res = yield await Api.get('/users');
   if(response.status === 200)
       const data = yield await response.json();              
       cb(data);
   }
}))

fetchUsers((users) => console.log(users)); // will never be called
fetchUsers((users) => console.log(users)); // will never be called
fetchUsers((users) => console.log(users)); // only this get's called
```

#### distinctUntilChanged
```
const equals = ()
const updateFormField = distinctUntilChanged(function(id, field, value) {
   return Api.put(`/sheets/${id}`, {field, value});
}, /*optional 'equals' comparator */)


updateFormField(1, 'name' 'John'); // Will invoke update request
updateFormField(1, 'name' 'John'); // -- skipped --
updateFormField(1, 'name' 'John Doe'); // Will invoke update request  
```

#### (messy) combined
```
const getUsers = distinctUntilChanged(debounce(takeLatest(async function * (group, cb){
        const result = yield await Api.get(`/users/${group}`);
        const data = yield await response.json();
        cb(data)        
    }) ,200))
```


#### build
##### Limited type support
```
const getUsers = build()
        .distinctUntilChanged()
        .debounce(200)
        .takeLatest()
        .callback(async function *(group, cb){
           const result = yield await Api.get(`/users/${group}`);
           const data = yield await response.json();
           cb(data)        
       })
```

