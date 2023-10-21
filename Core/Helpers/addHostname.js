export const addHostnameToUserAvatarAndReturn = (user) => {
  return {
    ...user,
    avatarUrl: `${process.env.HOSTNAME}:${process.env.SERVER_PORT}/${user.avatarUrl}`,
  }
}

export const addHostnameToBlogImageAndReturn = (post) => {
  return {
    ...post,
    imageUrl: `${process.env.HOSTNAME}:${process.env.SERVER_PORT}/${post.imageUrl}`,
  }
}