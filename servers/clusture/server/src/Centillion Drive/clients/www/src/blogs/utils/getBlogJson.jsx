import blogJson from '../../blogs.json'

export default (urlName) => blogJson.find((blog) => blog.urlName === urlName)