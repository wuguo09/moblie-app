# 使用history模式路由
参考文档 https://blog.csdn.net/qq_43684588/article/details/133177809
    1、配置manifest.json文件
        · h5.router.mode = history
        . h5.router.base = {appName} //发布后需要，定义工作目录
    2、上线后需要配置nginx，代理到工作目录
        我们本来就有代理，应该不用管
        