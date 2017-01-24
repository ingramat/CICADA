<?php

// include('./DataClass.php');

class ProfileData {
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

    public function __construct($in_id=null,$in_user_id=null,$in_user_name=null,$in_user_pwd=null,
                       $in_mail_adrs=null,$in_profile_img=null,$in_profile_text=null,
                       $in_follow_ids=null,$in_follower_ids=null,$in_reg_date=null,
                       $in_all_like_count=null ){

        $this->id = $in_id;
        $this->user_id = $in_user_id;
        $this->user_name = $in_user_name;
        $this->user_pwd = $in_user_pwd;
        $this->mail_adrs = $in_mail_adrs;
        $this->profile_img = $in_profile_img;
        $this->profile_text = $in_profile_text;
        $this->reg_date = $in_reg_date;
        $this->all_like_count = $in_all_like_count;
    }
}

class TweetData {

    public $id;
    public $tw_date;
    public $tw_user_id;
    public $tw_text;
    public $retw_id;
    public $retw_user_id;
    public $retw_date;
    public $retw_count;
    public $tw_img;
    public $like_count;

    public function __construct($in_id=null,$in_tw_date=null,$in_tw_user_id=null,$in_tw_text=null,
                       $in_retw_id=null,$in_retw_user_id=null,$in_retw_date=null,
                       $in_retw_count=null,$in_tw_img=null,$in_like_count=null){

        $this->id = $in_id;
        $this->tw_date = $in_tw_date;
        $this->tw_user_id = $in_tw_user_id;
        $this->tw_text = $in_tw_text;
        $this->retw_id = $in_retw_id;
        $this->retw_user_id = $in_retw_user_id;
        $this->retw_date = $in_retw_date;
        $this->retw_count = $in_retw_count;
        $this->tw_img = $in_tw_img;
        $this->like_count = $in_like_count;
    }

}

 $profile = new ProfileData(1,'test01','test01','test01','test01@tes.ts',null,
                             'test01です。よろしく！',null,[2],'2017-01-19 18:43:52',0);

 echo json_encode($profile);
// echo include('./DataClass.php');

exit();
?>