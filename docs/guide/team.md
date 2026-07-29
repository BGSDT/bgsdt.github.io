---
layout: page
---
<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamMembers,
  VPTeamPageSection
} from 'vitepress/theme'

const members_1 = [
  {
    avatar: 'https://i.mcmod.cn/user/avatar/104/1045433/1045433_1759753240_sDHx.png',
    name: '北咕',
    title: '所有者',
    links: [
      { icon: 'github', link: 'http://github.com/BGSDT' },
      { icon: 'modrinth', link: 'https://modrinth.com/user/BGSDT' },
      { icon: 'bilibili', link: 'https://space.bilibili.com/3493084226652280' }
    ]
  },
  {
    avatar: 'https://i.mcmod.cn/author/cover/20260412/1775965924_2_lrpQ.jpg',
    name: '潇湘-迷蝎',
    title: '程序/设计',
    links: [
      { icon: 'tiktok', link: 'https://www.douyin.com/user/MS4wLjABAAAAzkT3LsLab4qgHayqcQ1lmBCVnhvg3NLsF1sC4C5AEPyRUZDzQPmRcGBpA0-4parC' },
      { icon: 'modrinth', link: 'https://modrinth.com/user/YYR' },
      { icon: 'bilibili', link: 'https://space.bilibili.com/3546802705926359' }
    ]
  },
  {
    avatar: 'https://i.mcmod.cn/user/avatar/135/1356344/1356344_1771846207_BBAY.png',
    name: 'Rolling Cat',
    title: '程序',
    links: [
      { icon: 'github', link: 'https://github.com/Rolling-Catawa' },
      { icon: 'modrinth', link: 'https://modrinth.com/user/Rolling-Catawa' }
    ]
  },
  {
    avatar: 'https://i.mcmod.cn/user/avatar/112/1120453/1120453_1747470177_ZplP.png',
    name: '提蒸蟹',
    title: '贡献者',
    links: [
      { icon: 'modrinth', link: 'https://modrinth.com/user/TiZhengXie' },
      { icon: 'bilibili', link: 'https://space.bilibili.com/2035635549' }
    ]
  },
  {
    avatar: 'https://i.mcmod.cn/author/avatar/github/1782665736_ttwMUcxI.png',
    name: 'Itz_NanGua',
    title: '贡献者'
  },
  {
    avatar: 'https://i.mcmod.cn/user/avatar/141/1411561/1411561_1778928953_SslC.png',
    name: 'CR400BF_G_5133',
    title: '贡献者',
    links: [
      { icon: 'bilibili', link: 'https://space.bilibili.com/573827263/' }
    ]
  },
  {
    avatar: 'https://i.mcmod.cn/user/avatar/68/686012/686012_1747403022_VWtb.png',
    name: 'Yomi_307',
    title: '贡献者',
    links: [
      { icon: 'github', link: 'https://github.com/yomi-china' },
      { icon: 'modrinth', link: 'https://modrinth.com/user/yomi_307' }
    ]
  }
]

const members_2 = [
  {
    avatar: 'https://i.mcmod.cn/author/avatar/github/1782665736_ttwMUcxI.png',
    name: 'Itz_NanGua',
    title: '贡献者'
  }
]
</script>

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>
      开发成员
    </template>
    <template #lead>
     云北团队是专注于开发 Minecraft 城市建设类模组以及城市建设的团队，由社区爱好者组成的社区团队。
    </template>
  </VPTeamPageTitle>
  <VPTeamPageSection>
    <template #title>云北城建</template>
    <template #lead>云北城建是一款城市建设模组，专注于城市交通基础设施还原，集道路方块、道路标识、市政设施、交通设备及实用道具于一体，均按照现实还原。</template>
    <template #members>
      <VPTeamMembers size="small" :members="members_1" />
    </template>
  </VPTeamPageSection>
  <VPTeamPageSection>
    <template #title>道路标志生成器</template>
    <template #lead>道路标志生成器是面向道路设计爱好者的在线工具，可一键生成根据国标制作的标准交通标志牌素材。</template>
    <template #members>
      <VPTeamMembers size="small" :members="members_2" />
    </template>
  </VPTeamPageSection>
</VPTeamPage>