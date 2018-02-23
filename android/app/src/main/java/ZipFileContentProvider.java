package com.my.package;

import com.android.vending.expansion.zipfile_sound.APEZProvider;
import android.net.Uri;
import java.io.File;

public class ZipFileContentProvider extends APEZProvider {
    private static final String AUTHORITY = "com.my.package.provider";

    @Override
    public String getAuthority() {
        return AUTHORITY;
    }

    public static Uri buildUri(String path) {
        StringBuilder contentPath = new StringBuilder("content://");
        contentPath.append(AUTHORITY);
        contentPath.append(File.separator);
        contentPath.append(path);
        return Uri.parse(contentPath.toString());
    }
}