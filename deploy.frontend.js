const path = require('path')
const fs = require('fs')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

const HOME = process.env.HOME
const srcDir = path.resolve(HOME, './zbt/zbedu-webapp')

fs.stat(srcDir, function (err, stats) {
	const simpleGit = require('simple-git')()
	if (err || !stats.isDirectory()) {
		console.log(srcDir + ' not exists, create it...')
		fs.mkdirSync(srcDir, { recursive: true })
		fs.chmodSync(srcDir, 0o777)
		simpleGit.cwd(srcDir)
		simpleGit.clone('git@github.com:ZBZHT/zbedu-webapp.git',srcDir, ()=>{
			console.log('clone success....')
			build(simpleGit)
		})
	} else {
		console.log(srcDir + ' exists. pull all updates from the specified remote branch (eg origin/master)')
		fs.chmodSync(srcDir, 0o777)
		simpleGit.cwd(srcDir)
		simpleGit.pull('origin', 'master', (err, update) => {
			//console.log(err)
			//console.log(update)
			if(err) {
				console.log(err)
				return
			}
			console.log('pull updates from origin/master success...')
			/*
			PullSummary {
			  files: [],
			  insertions: {},
			  deletions: {},
			  summary: { changes: 0, insertions: 0, deletions: 0 },
			  created: [],
			  deleted: [] }
			  */
			if(update) {
				if(update.summary.changes) {
					console.log(`changes ${update.summary.changes} from origin/master...`)
				} else {
					console.log('no changes from origin/master...')
				}
				build(simpleGit)
			}
		})
	}
})

async function build(git) {
	console.log('start build....')
	try {
		console.log('install dependencies packages...')
		const { stdout, stderr } = await exec('npm install', {cwd: srcDir})
		console.log(`stdout: ${stdout}`)
		console.log(`stderr: ${stderr}`)
	} catch (excepction) {
		console.error(`exec excepction: ${excepction}`);
		return;
	}
	try {
		console.log('build project...')
		const { stdout, stderr } = await exec('npm run build', {cwd: srcDir})
		console.log(`stdout: ${stdout}`)
		console.log(`stderr: ${stderr}`)
	} catch (excepction) {
		console.error(`exec excepction: ${excepction}`);
		return;
	}
	try {
		console.log('start install project...')
		const { stdout, stderr } = await exec('cp -r /home/bwy/zbt/zbedu-webapp/dist/* /www/zbt-client/')
		console.log(`stdout: ${stdout}`)
		console.log(`stderr: ${stderr}`)
	} catch (excepction) {
		console.error(`exec excepction: ${excepction}`);
		return;
	}
}
