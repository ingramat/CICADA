<?php
	//idをSessionで持ってくる
	session_start();
	include('./common_funcs.php');
	include('./DataClass.php');


	//jsからget request が来た時
	if(isset($_GET['user_id'])){
		$get_id = $_GET['user_id'];
		$pdo = db_connect();
		$sql = 'SELECT * FROM `tweet` WHERE `tw_user_id` = :tw_userId';
		// $stmt = '';

		// $sql += `:tw_userId`;
 	   	$stmt = $pdo->prepare($sql);
    	$stmt->bindValue(':tw_userId',$get_id,PDO::PARAM_INT);
		$res = $stmt->execute();

		//sql error confirmation
		if ($res == false){
			$error = $stmt->errorInfo();
			exit('SQL Error:'.$error[2]);
		}else{
			$tw = array();
			$i = 0;

			while($data = $stmt->fetch(PDO::FETCH_ASSOC)){
				$tw[$i] = new TweetData(
					$data['id'],
				    $data['tw_date'],
				    $data['tw_user_id'],
				    $data['tw_text'],
				    $data['retw_id'],
				    $data['retw_user_id'],
				    $data['retw_date'],
				    $data['retw_count'],
				    $data['tw_img'],
				    $data['like_count']
			    );
				$i++;
			}
			echo json_encode($tw,JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
		}
	}


	// $pdo = db_connect();
	// //testでidを指定
	// $sql = 'SELECT * FROM `Profile`  WHERE `user_id` = ';
	// $stmt = '';

	// $sql += `:userId`;
 //    $stmt = $pdo->prepare($sql);
 //    $stmt->bindValue(':userId;',$get_id,PDO::PARAM_STR);

 //    //sql文の実行
	// $res = $stmt->execute();

	// //sql error confirmation
	// if ($res == false){
	// 	$error = $stmt->errorInfo();
	// 	exit('SQL Error:'.$error[2]);
	// }else{
	// 	//input profile data to $data
	// 	$data = $stmt->fetch(PDO::FETCH_ASSOC);

	// $profile = new ProfileData(
	// 				$data['id'],
	// 				$data['user_id'],
	// 				$data['user_name'],
	// 				$data['user_pwd'],
	// 				$data['mail_adrs'],
	// 				$data['profile_img'],
 //                    $data['profile_text'],
 //                    json_decode($data['follow_ids']),
 //                    json_decode($data['follower_ids']),
 //                    $data['reg_date'],
 //                    $data['all_like_count']);
	// }

	// echo json_encode($profile,JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
// }

  ?>