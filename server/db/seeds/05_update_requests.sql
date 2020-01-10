update requests set current_bid_id = 2 where id = 1;
update requests set current_bid_id = 4 where id = 2;
update requests set current_bid_id = 3 where id = 3;
update requests set request_status = 'closed' where id = 4;