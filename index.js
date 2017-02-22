var GitHubApi = require('github');
var request = require("request");

var github = new GitHubApi({});


exports.handler = function(event, context) {


  var url = "http://www.lemonde.fr/webservice/decodex/updates";

  request({
    url: url,
    json: true
  }, function (error, response, body) {

    if (!error && response.statusCode === 200) {

      github.authenticate({
        type: 'oauth',
        token: 'XXXX'
      }, function(err, res) {
        // console.log(err);
        // console.log(res);
      });

      var ref_master_sha = '';

      github.gitdata.getReference({
        owner: 'mtparet',
        repo: 'decodex-data',
        ref: "heads/master"
      }, function(err, res) {
        // console.log(err);
        // console.log(res);
        ref_master_sha = res.object.sha;
      });

      github.gitdata.createTree({
        owner: 'mtparet',
        repo: 'decodex-data',
        tree: [
          {
            "path": "decodex.json",
            "mode": "100644",
            "type": "blob",
            "content": JSON.stringify(body, undefined, 2)
          }
        ],
        base_tree: 'master'
      }, function(err, res) {
        // console.log(err);
        // console.log(res);

        github.gitdata.createCommit({
          owner: 'mtparet',
          repo: 'decodex-data',
          message: 'automatic update',
          tree: res.sha,
          parents: [ref_master_sha]
        }, function(err, res) {
          //  console.log(err);
          //  console.log(res);

          github.repos.getCommit({
            owner: 'mtparet',
            repo: 'decodex-data',
            sha: res.sha
          }, function(err, res) {
            // console.log(err);
            // console.log(res);
            console.log(res.stats);
            if (res.stats.total == 0){
              console.log('nothing to modify');
            } else {
              github.gitdata.updateReference({
                owner: 'mtparet',
                repo: 'decodex-data',
                ref: "heads/master",
                sha: res.sha,
                force: true
              }, function(err, res) {
                console.log(err);
                console.log(res);
                context.done;
              });
            }
          });

        });
      });
    }
  });

};