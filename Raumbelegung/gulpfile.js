/*
 *  Copyright (C) 2025 DE SIGNO GmbH
 *
 *  This program is dual licensed. If you did not license the program under
 *  different terms, the following applies:
 *
 *  This program is free software: You can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

import { deleteSync as del } from "del";
import gulp from "gulp";
import { exec } from "child_process";
import git from "gulp-git";
import handlebars from "handlebars";
import rename from "gulp-rename";
import zip from "gulp-zip";
import merge from "merge-stream";
import through2 from 'through2';

const customersuffix = "";
const customername = "";


let spec = 
{
  name: "raumbelegung",
  clean: "../dist/raumbelegung_*.zip",
  files: ["../dist/raumbelegung/browser/**"],
  templates: ["src/Styles.xml.hbs"],
  templateData: {
    suffix: customersuffix,
    option_name: customername,
  },
};

// create packages
gulp.task("clean_zip", function (done) {
  if (spec["clean"]) {
    del(spec["clean"], { force: true });
  }
  done();
});

var version;
gulp.task("read_version", function (done) {
  git.exec(
    {
      args: "describe --tags --dirty",
      quiet: true,
    },
    (err, out) => {
      version = out.trim();
      done();
    }
  );
});

// template task
gulp.task("template", () => {
  var hbData = {
    version: version,
  };
  var hbOptions = {};
  if (spec["templateData"]) {
    Object.assign(hbData, spec["templateData"]);
  }
  var templateStr = spec["templates"];
  var streams = [];
  streams.push(
    gulp
      .src(templateStr, { base: "./" }, { removeBOM: false })
      .pipe(through2.obj(function(file, enc, cb) {
        // compile using handlebars
        if (file.isBuffer()) {
          const templateStr = file.contents.toString(enc);
          const template = handlebars.compile(templateStr, hbOptions);
          const result = template(hbData);
          file.contents = Buffer.from(result);
        }
        cb(null, file);
      }))
      .pipe(
        rename(function (path) {
          path.extname = "";
        })
      )
      .pipe(gulp.dest("."))
  );
  return merge(streams);
});

// angular task
gulp.task("ng", function (cb) {
  exec(`npx ng build --configuration production`, function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

// zip task
gulp.task("zipit", function () {
  return gulp
    .src(spec["files"], { removeBOM: false })
    .pipe(zip(`${spec.name}_${version}.zip`))
    .pipe(gulp.dest("../dist"));
});

gulp.task(
  "zip",
  gulp.series("clean_zip", "read_version", gulp.series("template", "ng", "zipit"))
);
gulp.task("default", gulp.series(["zip"]));
