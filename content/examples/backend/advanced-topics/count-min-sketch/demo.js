const { CMS } = require('./cms');
const cms=new CMS(3,10); cms.add(7); cms.add(7); console.log(cms.query(7));