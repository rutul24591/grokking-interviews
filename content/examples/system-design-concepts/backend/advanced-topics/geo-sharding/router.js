function shardFor(region){ return region.startsWith('us') ? 'shard-us' : 'shard-eu'; }
module.exports={ shardFor };