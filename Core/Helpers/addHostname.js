export const addHostnameToUserAvatarAndReturn = (user) => {
  const url = user.avatarUrl ?
    `${process.env.HOSTNAME}:${process.env.SERVER_PORT}/${user.avatarUrl}`
    : '';

  return {
    ...user,
    avatarUrl: url,
  }
}

export const addHostnameToBlogImageAndReturn = (post) => {
  const url = post.imageUrl ?
    `${process.env.HOSTNAME}:${process.env.SERVER_PORT}/${post.imageUrl}`
    : '';

  return {
    ...post,
    imageUrl: url,
  }
}