import bluebird from 'bluebird'
import IBM from 'ibm-cos-sdk'

interface UploadStream {
	key: string
	bucket: string
	body: any
}

export const uploadStream = async ({ key, bucket, body }: UploadStream) => {
	const {
		IBM_ACCESSKEYID: ACCESS_KEY_ID,
		IBM_SECRET: SECRET_ACCESS_KEY,
		IBM_APIKEY: API_KEY
	} = process.env

	IBM.config.setPromisesDependency(bluebird)
	IBM.config.update({
		accessKeyId: ACCESS_KEY_ID,
		secretAccessKey: SECRET_ACCESS_KEY,
		apiKeyId: API_KEY
	})

	const s3 = new IBM.S3()

	const result = await s3
		.upload({
			Bucket: bucket,
			Key: key,
			Body: body,
			ACL: 'public-read'
		})
		.promise()

	return result.Location
}

export default uploadStream
