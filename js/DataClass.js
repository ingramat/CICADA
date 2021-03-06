'use strict'

class ProfileData {

    constructor(id=null,user_id=null,user_name=null,user_pwd=null,mail_adrs=null,profile_img=null,
                profile_text=null,follow_ids=null,follower_ids=null,reg_date=null,all_like_count=null){
        this.id = id;
        this.user_id = user_id;
        this.user_name= user_name;
        this.user_pwd = user_pwd;
        this.mail_adrs = mail_adrs;
        this.profile_img = profile_img;
        this.profile_text = profile_text;
        this.follow_ids = follow_ids;
        this.follower_ids = follower_ids;
        this.reg_date = reg_date;
        this.all_like_count = all_like_count;
    }

}


class TweetData {

    constructor(id=null,tw_date=null,tw_user_id=null,tw_text=null,retw_id=null,retw_user_id=null,
                retw_date=null,retw_count=null,tw_img=null,like_count=null){
        
        this.id = id;
        this.tw_date = tw_date;
        this.tw_user_id= tw_user_id;
        this.tw_text = tw_text;
        this.retw_id = retw_id;
        this.retw_user_id = retw_user_id;
        this.retw_date = retw_date;
        this.retw_count = retw_count;
        this.tw_img = tw_img;
        this.like_count = like_count;
    }

}