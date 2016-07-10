<?php

    function send($to, $subject, $body, $bcc_count = 500, $burst_time = 20)
    {
        add_filter('wp_mail_content_type', array('theme', 'set_html_content_type'));

        //Add headers
        $headers = array();
        $headers[] = "MIME-Version: 1.0";
        $headers[] = "Content-Type: text/html; charset=utf-8"; //iso-8859-1

        if (is_array($to)) {

            //Add header
            $headers[] = "X-MC-PreserveRecipients: false";

            //Store header for further use
            $default_headers = $headers;

            //Filter away duplicates (there should be none). And make shure they are trimmed.
            $to = array_map('trim', array_unique($to));

            //Validate all emails
            foreach ($to as $key => $reciver) {
                if (!filter_var($reciver, FILTER_VALIDATE_EMAIL)) {
                    unset($to[$key]);
                }
            }

            //Send if chunks of requested size
            $chunks = array_chunk($to, $bcc_count);

            //Burst mode?
            foreach ($chunks as $chunk) {

                //Reset BCC
                $headers = $default_headers;

                //Make BCC header
                $headers[] = "Bcc: " . implode(",", $chunk);

                //Send mail
                wp_mail("noreply@konstfackalumni.se", $subject, $body, $headers);

                //Wait Xms. Defined on request.
                usleep($burst_time*1000);
            }
        } else {
            //Check email adress once again, then send.
            if (theme::is_valid_email($to)) {
                wp_mail($to, $subject, $body, $headers);
            }
        }
        remove_filter('wp_mail_content_type', array('theme', 'set_html_content_type'));
    }


    function rsend($to, $subject, $body, $bcc_count = 500, $burst_time = 20)
    {
        add_filter('wp_mail_content_type', array('theme', 'set_html_content_type'));

        //Add headers
        $headers = array();
        $headers[] = "MIME-Version: 1.0";
        $headers[] = "Content-Type: text/html; charset=utf-8"; //iso-8859-1

        if (is_array($to)) {

            //Add header
            $headers[] = "X-MC-PreserveRecipients: false";

            //Filter away duplicates (there should be none). And make shure they are trimmed.
            $to         = array_map('trim', array_unique($to));

            //Validate all emails
            foreach ($to as $key => $reciver) {
                if (!filter_var($reciver, FILTER_VALIDATE_EMAIL)) {
                    unset($to[$key]);
                }
            }

            //Send if chunks of requested size
            $chunks = array_chunk($to, $bcc_count);

            //Burst mode?
            foreach ($chunks as $chunk) {

                //Empty BCC if filled
                if (is_array($headers) && !empty($headers)) {
                    foreach ($headers as $headerkey => $headeritm) {
                        if (substr($headeritm, 0, 4) == "Bcc:") {
                            unset($headers[$key]);
                        }
                    }
                }

                //Make BCC header
                $headers[] = "Bcc: " . implode(",", $chunk);

                //Send mail
                wp_mail("noreply@konstfackalumni.se", $subject, $body, $headers);

                //Wait Xms. Defined on request.
                usleep($burst_time*1000);
            }
        } else {
            //Check email adress once again, then send.
            if (theme::is_valid_email($to)) {
                wp_mail($to, $subject, $body, $headers);
            }
        }
        remove_filter('wp_mail_content_type', array('theme', 'set_html_content_type'));
    }
