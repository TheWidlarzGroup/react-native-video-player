package com.my.package;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.graphics.PixelFormat;
import android.media.MediaPlayer;
import android.net.Uri;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.widget.MediaController;
import android.widget.Toast;
import android.widget.VideoView;
import android.view.View;
import android.view.MotionEvent;

public class VideoActivity extends AppCompatActivity {
    private String videoPath;
    private int videoPosition, clickCount = 0;
    private long startTime, duration;
    private Bundle extras;
    private static final int MAX_DURATION = 500;
    private static ProgressDialog progressDialog;
    private static MediaController mediaController;

    VideoView myVideoView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE);
        setContentView(R.layout.player_fullscreen);
        Intent i = getIntent();
        if(i != null){
            extras = i.getExtras();
            videoPath = extras.getString("VIDEO_URL");
            videoPosition = extras.getInt("VIDEO_POSITION");
            myVideoView = (VideoView) findViewById(R.id.videoView);
            progressDialog = ProgressDialog.show(VideoActivity.this, "", "Buffering video...", true);
            progressDialog.setCancelable(true);
            PlayVideo();
        }
        else{
            Toast.makeText(VideoActivity.this, "VideoURL not found", Toast.LENGTH_SHORT).show();
        }


        // Touch listener to: show MediaControllers on singleclick &  close fullscreen video on doubleclick
        myVideoView.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                switch(event.getAction() & MotionEvent.ACTION_MASK)
                {
                case MotionEvent.ACTION_UP:
                    clickCount++;
                    if(clickCount >= 2) {
                        duration = System.currentTimeMillis() - startTime;
                        if(duration<= MAX_DURATION) {
                            finishProgress();   // Close the fullscreen video view on doubleclick.
                            return true;
                        }
                    }
                    startTime = System.currentTimeMillis();
                    return false;
                }
                return true;
            }
        });
    }

    private void PlayVideo() {
        try {
            getWindow().setFormat(PixelFormat.TRANSLUCENT);
            mediaController = new MediaController(VideoActivity.this);
            mediaController.setAnchorView(myVideoView);

            Uri video = Uri.parse(videoPath);
            myVideoView.setMediaController(mediaController);
            myVideoView.setVideoURI(video);
            myVideoView.requestFocus();
            myVideoView.setKeepScreenOn(true);
            myVideoView.seekTo(videoPosition * 1000);
            mediaController.setPrevNextListeners(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    // next button clicked
                    mediaController.show();
                }
            }, new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    finish();
                }
            });
            myVideoView.setOnPreparedListener(new MediaPlayer.OnPreparedListener() {
                public void onPrepared(MediaPlayer mp) {
                    progressDialog.dismiss();
                    myVideoView.start();
                }
            });
            myVideoView.setOnCompletionListener(new MediaPlayer.OnCompletionListener () {
                public void onCompletion(MediaPlayer mp) {
                    finishProgress(true);
                }
            });


        } catch (Exception e) {
            progressDialog.dismiss();
            System.out.println("Video Play Error :" + e.toString());
            finishProgress();
        }

    }

    protected void finishProgress() {
        this.finishProgress(false);
    }

    // Called instead of finish() to always send back the progress.
    protected void finishProgress(Boolean isEnd) {
        Intent resultIntent = new Intent(Intent.ACTION_PICK);
        int position = myVideoView.getCurrentPosition();
        if (isEnd) {
            position = 0;
        }
        resultIntent.putExtra("VIDEO_POSITION", position);
        setResult(Activity.RESULT_OK, resultIntent);
        finish();
    }

    // Pass the progress back on the user pressing the back button.
    public void onBackPressed(){
        finishProgress();
    }
    public void onClick(View v) {
        switch(v.getId()) {
            case R.id.closeBtn:
                finishProgress();
                break;
        }
    }
}
