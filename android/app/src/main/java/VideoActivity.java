package com.my.package;

import android.app.ProgressDialog;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.graphics.PixelFormat;
import android.media.MediaPlayer;
import android.net.Uri;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.widget.MediaController;
import android.widget.Toast;
import android.widget.VideoView;

public class VideoActivity extends AppCompatActivity {
    private String videoPath;

    private static ProgressDialog progressDialog;
    VideoView myVideoView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE);
        setContentView(R.layout.player_fullscreen);
        Intent i = getIntent();
        if(i != null){
            myVideoView = (VideoView) findViewById(R.id.videoView);
            videoPath = i.getStringExtra("VIDEO_URL");
            progressDialog = ProgressDialog.show(VideoActivity.this, "", "Buffering video...", true);
            progressDialog.setCancelable(true);
            PlayVideo();
        }
        else{
            Toast.makeText(VideoActivity.this, "VideoURL not found", Toast.LENGTH_SHORT).show();
        }


    }

    private void PlayVideo() {
        try {
            getWindow().setFormat(PixelFormat.TRANSLUCENT);
            MediaController mediaController = new MediaController(VideoActivity.this);
            mediaController.setAnchorView(myVideoView);

            Uri video = Uri.parse(videoPath);
            myVideoView.setMediaController(mediaController);
            myVideoView.setVideoURI(video);
            myVideoView.requestFocus();
            myVideoView.setOnPreparedListener(new MediaPlayer.OnPreparedListener() {
                public void onPrepared(MediaPlayer mp) {
                    progressDialog.dismiss();
                    myVideoView.start();
                }
            });


        } catch (Exception e) {
            progressDialog.dismiss();
            System.out.println("Video Play Error :" + e.toString());
            finish();
        }

    }
}
