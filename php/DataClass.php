<?php
class Profile {
    public $id;
    public $user_id;
    public $user_name;
    public $user_pwd;
    public $mail_adrs;
    public $profile_img;
    public $profile_text;
    public $follow_ids;
    public $follower_ids;
    public $reg_date;
    public $all_like_count;
    public $tw_count;
    public $follow_count;
    public $follower_count;

    public function __construct($in_id=null,$in_user_id=null,$in_user_name=null,$in_user_pwd=null,$in_mail_adrs=null,
                                $in_profile_img=null,$in_profile_text=null,$in_follow_ids=null,$in_follower_ids=null,
                                $in_reg_date=null,$in_all_like_count=null,$in_tw_count=null,$in_follow_count=null,$in_follower_count=null ){

        $this->id = $in_id;
        $this->user_id = $in_user_id;
        $this->user_name = $in_user_name;
        $this->user_pwd = $in_user_pwd;
        $this->mail_adrs = $in_mail_adrs;
        $this->profile_img = $in_profile_img;
        $this->profile_text = $in_profile_text;
        $this->follow_ids = $in_follow_ids;
        $this->follower_ids = $in_follower_ids;
        $this->reg_date = $in_reg_date;
        $this->all_like_count = $in_all_like_count;
        $this->tw_count = $in_tw_count;
        $this->follow_count = $in_follow_count;
        $this->follower_count = $in_follower_count;
    }
}

class ProfileData {
    public $profiles = array();
    public $next_index;
    public $is_end = false;

    public function __construct($in_profiles=array(),$in_next_index = 0,$in_is_end=false){
        
        $this->profiles = $in_profiles;
        $this->next_index = $in_next_index;
        $this->is_end = $in_is_end;
    }

}


class Tweet {
    public $id;
    public $tw_date;
    public $tw_user_id;
    public $tw_text;
    public $retw_id;
    public $retw_user_id;
    public $retw_date;
    public $retw_text;
    public $retw_count;
    public $tw_img;
    public $like_count;
    public $tw_user_name;
    public $tw_user_usrId;
    public $tw_profile_img;
    public $retw_user_name;
    public $retw_user_usrId;
    public $retw_profile_img;


    public function __construct($in_id=null,$in_tw_date=null,$in_tw_user_id=null,$in_tw_text=null,$in_retw_id=null,$in_retw_user_id=null,
                                $in_retw_date=null,$in_retw_text=null,$in_retw_count=null,$in_tw_img=null,$in_like_count=null,$in_tw_user_name=null,$in_tw_user_usrId=null,
                                $in_tw_profile_img=null,$in_retw_user_name=null,$in_retw_user_usrId=null,$in_retw_profile_img=null){

        $this->id = $in_id;
        $this->tw_date = $in_tw_date;
        $this->tw_user_id = $in_tw_user_id;
        $this->tw_text = $in_tw_text;
        $this->retw_id = $in_retw_id;
        $this->retw_user_id = $in_retw_user_id;
        $this->retw_date = $in_retw_date;
        $this->retw_text = $in_retw_text;
        $this->retw_count = $in_retw_count;
        $this->tw_img = $in_tw_img;
        $this->like_count = $in_like_count;
        $this->tw_user_name = $in_tw_user_name;
        $this->tw_user_usrId = $in_tw_user_usrId;
        $this->tw_profile_img = $in_tw_profile_img;
        $this->retw_user_name = $in_retw_user_name;
        $this->retw_user_usrId = $in_retw_user_usrId;
        $this->retw_profile_img = $in_retw_profile_img;
    }

}

class TweetData{

    public $tweets = array();
    public $next_index;
    public $is_end = false;

    public function __construct($in_tweets=array(),$in_next_index = 0,$in_is_end=false){
        
        $this->tweets = $in_tweets;
        $this->next_index = $in_next_index;
        $this->is_end = $in_is_end;
    }
}
?>