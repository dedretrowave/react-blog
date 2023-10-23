export const addHostnameToUserAvatarAndReturn = (user) => {
  const url = user.avatarUrl ?
    `${process.env.DOMAIN}/${user.avatarUrl}`
    : '';

  return {
    ...user,
    avatarUrl: url,
  }
}

export const addHostnameToBlogImageAndReturn = (post) => {
  const url = post.imageUrl ?
    `${process.env.DOMAIN}/${post.imageUrl}`
    : '';

  return {
    ...post,
    imageUrl: url,
  }
}